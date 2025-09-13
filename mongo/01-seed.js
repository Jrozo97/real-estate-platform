(() => {
  const N = 36; 
  const MIN_PRICE = 300_000_000;
  const MAX_PRICE = 1_200_000_000;

  // Utilidades mejoradas
  const pad3 = (n) => String(n).padStart(3, "0");
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[randInt(0, arr.length - 1)];
  
  // Función mejorada para fechas válidas
  const iso = (y, m, d) => {
    // Asegurar que el día sea válido para el mes
    const daysInMonth = new Date(y, m, 0).getDate();
    const validDay = Math.min(d, daysInMonth);
    return ISODate(`${y}-${String(m).padStart(2,"0")}-${String(validDay).padStart(2,"0")}T00:00:00Z`);
  };

  const cities = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena", "Manizales", "Pereira", "Ibagué"];
  const streetNames = [
    "Cra 7", "Cra 13", "Cra 15", "Cra 30", "Av. Boyacá", "Av. 68", "Calle 60", "Calle 72", "Calle 26",
    "Av. Regional", "Av. El Poblado", "Calle 10", "Av. Oriental", "Calle 5", "Av. Roosevelt", "Cra 50"
  ];
  const ownerNames = [
    "Juan Pérez", "María Gómez", "Carlos Rodríguez", "Luisa Fernández", "Andrés Ruiz",
    "Sofía Ramírez", "Pedro Torres", "Camila López", "Felipe Acosta", "Daniela Vargas",
    "Julián Martínez", "Valentina Ríos", "Diego Herrera", "Paula Castro", "Laura Méndez",
    "Ricardo Patiño", "Nicolás Molina", "Sara Beltrán"
  ];

  // Limpia colección e índices
  db.properties.deleteMany({});
  try { db.properties.dropIndexes(); } catch (e) {} // por si no existen
  db.properties.createIndex({ name: 1, address: 1, price: 1 }, { name: "idx_name_address_price" });

  const docs = [];

  for (let i = 1; i <= N; i++) {
    const id = `P-${pad3(i)}`;
    const codeInternal = `C-${pad3(i)}`;
    const city = pick(cities);
    const street = pick(streetNames);
    const num1 = randInt(1, 99);
    const num2 = randInt(1, 99);
    const address = `${street} #${num1}-${num2}, ${city}`;

    const basePrice = randInt(MIN_PRICE, MAX_PRICE);
    const year = randInt(2005, 2024);

    const ownerIdx = (i - 1) % ownerNames.length;
    const ownerId = `O-${pad3(100 + ownerIdx)}`; // Mejorado: pad3 para consistencia
    const ownerBirthYear = randInt(1975, 1998);
    const ownerBirthMonth = randInt(1, 12);
    const ownerBirthDay = randInt(1, 28); // Día seguro para cualquier mes
    const ownerBirth = iso(ownerBirthYear, ownerBirthMonth, ownerBirthDay);

    // Imágenes (3) — todas habilitadas por defecto, solo algunas deshabilitadas ocasionalmente
    const images = [
      { 
        id: `PI-${pad3(i)}-1`, 
        file: `https://picsum.photos/seed/${id.toLowerCase()}a/800/600`, 
        enabled: true 
      },
      { 
        id: `PI-${pad3(i)}-2`, 
        file: `https://picsum.photos/seed/${id.toLowerCase()}b/800/600`, 
        enabled: randInt(1, 100) > 15 // 85% probabilidad de estar habilitada
      },
      { 
        id: `PI-${pad3(i)}-3`, 
        file: `https://picsum.photos/seed/${id.toLowerCase()}c/800/600`, 
        enabled: true 
      }
    ];

    // Trazas (2) — una compra y un reavalúo con fechas válidas
    const saleYear1 = Math.max(2015, randInt(year - 3, year - 1));
    const saleYear2 = randInt(Math.max(year, 2018), 2024); // Cambiado a 2024 para evitar fechas futuras
    
    const value1 = Math.round(basePrice * (0.85 + Math.random() * 0.1)); // 85%–95%
    const value2 = Math.round(basePrice * (1.02 + Math.random() * 0.12)); // 102%–114%
    
    const traces = [
      { 
        id: `T-${pad3(i)}-1`, 
        dateSale: iso(saleYear1, randInt(1,12), randInt(1,28)), 
        name: "Compra",   
        value: value1, 
        tax: 0.04 
      },
      { 
        id: `T-${pad3(i)}-2`, 
        dateSale: iso(saleYear2, randInt(1,12), randInt(1,28)), 
        name: "Reavalúo", 
        value: value2, 
        tax: 0.00 
      }
    ];

    // Generar nombre de propiedad más consistente
    const propertyTypes = ["Casa", "Apto", "Lote", "Dúplex", "Penthouse", "Oficina", "Bodega"];
    const neighborhoods = ["San Martín","Chapinero Alto","Laureles","El Prado","Alameda","Santa Bárbara","San Antonio","El Poblado","Teusaquillo"];
    const propertyName = `${pick(propertyTypes)} ${pick(neighborhoods)}`;

    // Validar que todos los campos requeridos estén presentes
    const doc = {
      id,
      name: propertyName,
      address,
      price: basePrice,
      codeInternal,
      year,
      owner: {
        id: ownerId,
        name: ownerNames[ownerIdx],
        address: city,
        photo: `https://picsum.photos/seed/owner${pad3(100 + ownerIdx)}/200/200`,
        birthday: ownerBirth
      },
      images,
      traces
    };

    // Validación opcional para debug
    if (!doc.id || !doc.name || !doc.address || !doc.price) {
      print(`⚠️ Documento ${i} tiene campos faltantes:`, JSON.stringify(doc, null, 2));
    }

    docs.push(doc);
  }

  const res = db.properties.insertMany(docs);
  const insertedCount = res.insertedCount || Object.keys(res.insertedIds || {}).length;
  
  print(`✅ Insertados: ${insertedCount} documentos en 'properties' de '${db.getName()}'.`);
  
  // Mostrar estadísticas de muestra
  const sample = db.properties.findOne();
  print(`📝 Ejemplo de documento creado:`);
  print(JSON.stringify(sample, null, 2));
  
  // Verificar total de imágenes
  const totalImages = db.properties.aggregate([
    { $unwind: "$images" },
    { $count: "totalImages" }
  ]).toArray();
  
  if (totalImages.length > 0) {
    print(`📊 Total de imágenes creadas: ${totalImages[0].totalImages}`);
  }
})();
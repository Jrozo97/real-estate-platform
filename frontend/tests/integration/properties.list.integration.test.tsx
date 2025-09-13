import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProperties } from "../../src/modules/properties/hooks";


function PropertiesList() {
  const { data } = useProperties({ page: 1, pageSize: 12 }, "get");
  if (!data) return <div>Loading...</div>;
  return (
    <ul>
      {data.items.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

describe("Integration: Properties list", () => {
  it("renderiza datos de MSW", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <PropertiesList />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Casa San Martín/i)).toBeInTheDocument();
  });
});

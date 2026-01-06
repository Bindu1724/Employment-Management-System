
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes';
const qc = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppRoutes />
    </QueryClientProvider>
  );
}
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { Layout } from '@/components/Layout';
import { CoreProvider } from '@/context/CoreContext';

// Pages
import Home from '@/pages/Home';
import Atlas from '@/pages/Atlas';
import ResourceDetail from '@/pages/ResourceDetail';
import Packs from '@/pages/Packs';
import PackDetail from '@/pages/PackDetail';
import Builder from '@/pages/Builder';
import Profiles from '@/pages/Profiles';
import ProfileDetail from '@/pages/ProfileDetail';
import Community from '@/pages/Community';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/atlas" component={Atlas} />
          <Route path="/atlas/:id" component={ResourceDetail} />
          <Route path="/packs" component={Packs} />
          <Route path="/packs/:id" component={PackDetail} />
          <Route path="/builder" component={Builder} />
          <Route path="/profiles" component={Profiles} />
          <Route path="/profiles/:id" component={ProfileDetail} />
          <Route path="/community" component={Community} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CoreProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CoreProvider>
    </QueryClientProvider>
  );
}

export default App;

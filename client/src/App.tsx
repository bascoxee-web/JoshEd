import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LeasingHome from "./pages/leasing/LeasingHome";
import SpaceDetail from "./pages/leasing/SpaceDetail";
import SpaceFinder from "./pages/leasing/SpaceFinder";
import LandingPage from "./pages/leasing/LandingPage";

function Router() {
  return (
    <Switch>
      <Route path="/leasing/spaces/:slug" component={SpaceDetail} />
      <Route path="/leasing/space-finder" component={SpaceFinder} />
      <Route path="/leasing/for/:slug" component={LandingPage} />
      <Route path="/leasing" component={LeasingHome} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;

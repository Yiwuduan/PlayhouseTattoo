import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import Artists from "@/pages/artists";
import Artist from "@/pages/artist";
import About from "@/pages/about";
import Book from "@/pages/book";
import NotFound from "@/pages/not-found";
import Chatbot from "@/components/chatbot";

function Router() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto flex-1 px-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/artists" component={Artists} />
          <Route path="/artists/:slug" component={Artist} />
          <Route path="/about" component={About} />
          <Route path="/book" component={Book} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
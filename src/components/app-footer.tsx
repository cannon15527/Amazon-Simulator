export function AppFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Amazon Simulator. Not affiliated with any real megacorporations.</p>
        <p>All timelines, products, and existential crises are simulated.</p>
      </div>
    </footer>
  );
}

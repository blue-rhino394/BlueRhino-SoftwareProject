
class reservedRoutesClass {

    // Data-structures
    private data: Map<string, void>;


    constructor() {
        this.data = new Map<string, void>();
    }



    // Adds a route to this object
    public addRoute(routeToAdd: string): void {

        // If we already have this route..
        if (this.hasRoute(routeToAdd)) {
            return;
        }

        this.data.set(routeToAdd, null);
        console.log(`Added '${routeToAdd}' to reservedRoutes.`);
    }

    // Removes a route from this object
    public removeRoute(routeToRemove: string): boolean {

        // Try to remove and store if it was actually
        // removed
        const removeResult = this.data.delete(routeToRemove);

        if (removeResult) {
            console.log(`Removed '${routeToRemove}' from reservedRoutes.`);
        }

        return removeResult;
    }



    // Looks to see if the provided route is in this object
    public hasRoute(routeToLookFor: string): boolean {
        return this.data.has(routeToLookFor);
    }
}









let reservedRoutes = new reservedRoutesClass();
export { reservedRoutes };
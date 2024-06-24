export const computeLimit = (limit: string): number => {
    if (limit) {
        const recordsPerPage = parseInt(limit)
        return recordsPerPage
    }
    
    throw Error("Limit is required")
}

export const computeSkip = (page: string, limit: number): number => {
    if (page) {
        const skip = (parseInt(page) - 1) * limit
        return skip
    }

    throw Error("Page is required")
}
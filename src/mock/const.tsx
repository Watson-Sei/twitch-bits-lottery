export const tiers = (tier: string) => {
    switch (tier) {
        case "1000":
            return 1
        case "2000":
            return 2
        case "3000":
            return 3
    }
}
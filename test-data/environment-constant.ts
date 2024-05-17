export class environmentConstants {
    private static readonly _UIBaseUrl = "https://www.bbc.com/sport/football/scores-fixtures";
    private static readonly _APIBaseUrl = "https://v6.exchangerate-api.com/v6/1fc80820c72b0163bc9c7536/latest/USD"
    public static get UIBaseUrl() {
        return environmentConstants._UIBaseUrl;
    }

    public static get APIBaseUrl() {
        return environmentConstants._APIBaseUrl;
    }

}
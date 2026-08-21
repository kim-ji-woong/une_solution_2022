export default class CompanyJsonManager {
    static makeRequsetCompanyBoard() {
        const json = {
            "requsetCompanyBoard":true
        };

        return JSON.stringify(json);
    }
}
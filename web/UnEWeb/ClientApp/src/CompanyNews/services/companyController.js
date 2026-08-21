import CompanyJsonManager from './companyJsonManager';


export class CompanyController {
    static async requestCompanyBoard() {
        try {
            const jsonData = CompanyJsonManager.makeRequsetCompanyBoard();

            const res = await fetch('Company/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
                body: jsonData
        });

        if (res.ok) {
            const result = await res.json();

            if (result.success) {
                const companyBoard = {};

                companyBoard.boardNum = result.boardNum;
                companyBoard.boardTitle = result.boardTitle;
                companyBoard.boardContent = result.boardContent;
                companyBoard.boardDate = result.boardDate;
                companyBoard.boardPeople = result.boardPeople;

                return [companyBoard, ""];
            } else {
                return [null, result.message];
            }
        }
    }
    catch(e) {
        console.log(e);
    }

    return [null, "requestCompanyBoard 실패" ];
  }
}
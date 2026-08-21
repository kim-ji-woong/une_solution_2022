export class Controller {

    // 센서 히스토리 불러오기
    static async requestOptions() {
        try {
            const response = await fetch('Option/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            if (response.ok && response.status !== 204) {
                const data = await response.json();
                return data;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }
}
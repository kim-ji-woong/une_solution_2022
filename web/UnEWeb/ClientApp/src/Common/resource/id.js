export default class CommonResource {
    /* color 설정 */
    static colors = {
        background: '#fff',
        primary: '#00a0ff',
        secondary: '#ddd',
        fontPrimary: 'black',
        fontSecondary: 'gray',
    };
    
    /* 
    * font 설정
    * font는 2가지 type을 지원함
    * Pretendard, Spoqa Han Sans Neo
    */
    static font = {
        Pretendard: `'Pretendard', 'Noto Sans KR', sans-serif`,
        Spoqa: `'Spoqa Han Sans Neo', 'Noto Sans KR', sans-serif`
    };

    static location = {
        topStart: 'top-start',
        top: 'top',
        topEnd: 'top-end',
        bottomStart: 'bottom-start',
        bottom: 'bottom',
        bottomEnd: 'bottom-end',
        left: 'left',
        right: 'right'
    }

}
using Company.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Company.IDAL
{
    public interface ICreate
    {
        CompanyBoard CreateCompanyBoard(int nBoardNum, string nBoardTitle, string nBoardContent, string nBoardDate, string nBoardPeople);
    }
}

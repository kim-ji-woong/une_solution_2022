import React, { Component, useState } from 'react';

import { SensorDetectBox } from './../../styled';
import { DisasterType } from './../../styled';
import { Location } from './../../styled';
import { InquiryPeriod } from './../../styled';
import { InquiryPeriodSelect } from './../../styled';
import { SearchBtn } from './../../styled';


/* datePicker test */
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


class SensorDetectSelect extends Component {

    render() {
        return (
          <>
            <SensorDetectBox>
              <DisasterType>
                <span>재난타입</span>
                <select name="재난타입">
                  <option value="전체" selected>전체</option>
                  <option value="대기">대기</option>
                  <option value="수질">수질</option>
                  <option value="기상">기상</option>
                  <option value="VOC">VOC</option>
                  <option value="CCTV">CCTV</option>
                </select>
              </DisasterType>
              <Location>
                <span>위치</span>
                 <select name="위치">
                   <option value="전체">전체</option>
                   <option value="">-</option>
                   <option value="">-</option>
                   <option value="">-</option>
                 </select>
              </Location>

              <InquiryPeriod>
                <span>조회기간 지정</span>
                <label htmlFor="date">
                  <input type="date"
                    id="date"
                    value="2077-06-15" />
                </label>
              </InquiryPeriod>

             {/* <DatePicker
                dateFormat="yyyy-MM-dd"   
                className="input-datepicker"    
                minDate={new Date()}    
                closeOnScroll={true}   
                placeholderText="체크인 날짜 선택"   
                selected={checkInDate} 
                onChange={(date) => setCheckInDate(date)}
                /> */}

              <InquiryPeriodSelect>
                <span>조회기간 선택</span>
                <label htmlFor="date">
                <input type="date"
                    id="date"
                    /* max="2023-05-31"
                    min="2023-01-01" */ 
                    /* value="2023-03-31" */ />
                </label>
              </InquiryPeriodSelect>
              <SearchBtn>검색</SearchBtn>
            </SensorDetectBox>
          </>
        )
    }
}

export default SensorDetectSelect;
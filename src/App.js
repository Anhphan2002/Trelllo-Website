
//import React, { useState, useEffect } from 'react';
import AppBar from "./components/AppBar/AppBar";
import BoardBar from "./components/BoardBar/BoardBar";
import BoardContent from "./components/BoardContent/BoardContent";
//import { initData } from './actions/initData';

function App() {
    // // State để lưu trữ dữ liệu boards
    // const [boardsData, setBoardsData] = useState(initData);

    // // Hàm lưu dữ liệu vào localStorage
    // const saveDataToLocalStorage = (data) => {
    //   localStorage.setItem('boardsData', JSON.stringify(data));
    // };
  
    // // Hàm lấy dữ liệu từ localStorage
    // const getDataFromLocalStorage = () => {
    //   const data = localStorage.getItem('boardsData');
    //   return data ? JSON.parse(data) : initData;
    // };
  
    // // Effect để lấy dữ liệu từ localStorage khi component được mount
    // useEffect(() => {
    //   const data = getDataFromLocalStorage();
    //   setBoardsData(data);
    // }, []);
  
    // // Effect để lưu dữ liệu vào localStorage khi dữ liệu boardsData thay đổi
    // useEffect(() => {
    //   saveDataToLocalStorage(boardsData);
    // }, [boardsData]);
  
    // Các thành phần JSX của ứng dụng
    // ...
  return (
      <div className="trello-master">
          <AppBar />
          <BoardBar />

          <BoardContent />
      </div>
  )
}

export default App;

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './picturWall.css';
import { UploadFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons/lib';
import defaultFileList from './defaultFileList';
import { PicturesGrid } from './PicturesGrid';
import { PicturesWall } from './PicturesWall';

const App = () => {
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList);


  return (
    <>
      <PicturesWall
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
      >
        {fileList.length >= 9 ? null : uploadButton}
      </PicturesWall>
      <hr style={{margin: '50px 0'}}/>
      <PicturesGrid
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
      >
        {fileList.length >= 9 ? null : uploadButton}
      </PicturesGrid>
    </>
  );
};


ReactDOM.render(<App />, document.getElementById('container'));

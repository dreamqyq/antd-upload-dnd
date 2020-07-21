import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { UploadFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons/lib';
import defaultFileList from './util/defaultFileList';
import { PicturesGrid } from './component/PicturesGrid';
import { PicturesWall } from './component/PicturesWall';

const App = () => {
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div>Upload</div>
    </div>
  );
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList);


  return (
    <>
      <div>
        <h2>基于 react-beautiful-dnd 的版本</h2>
        <PicturesWall
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </PicturesWall>
      </div>
      <hr style={{ margin: '50px 0' }} />
      <div style={{ width: '50%' }}>
        <h2>基于 react-sortable-hoc 的版本</h2>
        <PicturesGrid
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </PicturesGrid>
      </div>
    </>
  );
};


ReactDOM.render(<App />, document.getElementById('container'));

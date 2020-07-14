import React, { memo, useState } from "react";
import UploadList from "antd/es/upload/UploadList";
import { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";
import { Upload, Modal } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const getBase64 = (file: File | Blob | undefined): Promise<string> => {
  if (!file) return Promise.reject(new Error('no file'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file!);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

type Params = {
  image: string;
};
const imagePreview = async (file: UploadFile, callback: (params: Params) => void) => {
  const newFile = file;
  if (!newFile.url && !newFile.preview) {
    newFile.preview = await getBase64(file.originFileObj);
  }
  const newPreviewImage: string = newFile.url || newFile.preview || '';
  callback({
    image: newPreviewImage,
  });
};

function cloneDeep(obj: object) {
  const objStr = JSON.stringify(obj);
  return JSON.parse(objStr);
}

type Props = {
  onChange: any,
  fileList?: any[],
  listType: any
}
const PicturesWall: React.FC<Props> = memo(({ onChange: onChangeInitial, ...props }) => {
  const [fileList, setFileList] = useState(props.fileList || []);
  const [previewImage, setPreviewImage] = useState('');
  console.log(fileList)

  const onChange = ({ fileList }: any) => {
    setFileList(fileList);
    onChangeInitial({ fileList });
  };

  const onRemove = (file: any) => {
    const newFileList = cloneDeep(fileList).filter(
      (item: any) => item.uid !== file.uid
    );
    onChange({ fileList: newFileList });
  };

  const onDragEnd = ({ source, destination }: any) => {
    console.log(source, destination);
    if (!destination) {
      return;
    }
    const reorder = (list: any, startIndex: any, endIndex: any) => {
      console.log('list', list)
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);

      return list;
    };

    const newFileList = reorder(
      cloneDeep(fileList),
      source.index,
      destination.index
    );
    onChange({ fileList: newFileList });
  };

  const onPreview = async (file: any) => {
    await imagePreview(file, ({ image }) => {
      setPreviewImage(image);
    });
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const grid = 8
  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: grid,
    overflow: 'auto',
  });
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <>
      <Upload
        {...props}
        fileList={fileList}
        showUploadList={false}
        onChange={onChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {fileList && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction='horizontal'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {fileList.map((item, index) => (
                  <Draggable
                    key={item.uid}
                    draggableId={item.uid}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <UploadList
                          locale={{}}
                          showDownloadIcon={false}
                          listType={props.listType}
                          onPreview={onPreview}
                          onRemove={onRemove}
                          items={[item]}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <Modal
        visible={!!previewImage}
        width="60%"
        footer={null}
        onCancel={() => setPreviewImage('')}
      >
        <img style={{ width: "100%" }} alt="" src={previewImage} />
      </Modal>
    </>
  );
});

export { PicturesWall }
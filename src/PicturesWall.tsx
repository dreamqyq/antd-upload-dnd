import React, { memo, useState } from "react";
import UploadList from "antd/es/upload/UploadList";
import { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from "@ant-design/icons";
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

type Props = {
  onChange: any,
  fileList: any[],
  listType: any
}
const PicturesWall: React.FC<Props> = memo(({ onChange: onChangeInitial, ...props }) => {
  const [previewImage, setPreviewImage] = useState('');
  const { fileList } = props;
  console.log(fileList)

  const onChange = ({ fileList }: any) => {
    onChangeInitial(fileList);
  };

  const onRemove = (file: any) => {
    const newFileList = fileList.filter(
      (item: any) => item.uid !== file.uid
    );
    onChange({ fileList: newFileList });
  };

  const reorder = (list: any[], startIndex: any, endIndex: any) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  
  const onDragEnd = ({ source, destination }: any) => {
    if (!destination) {
      return;
    }

    const newFileList = reorder(
      fileList,
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
  const grid = 8
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: grid * 2,
    overflow: 'auto',
  });
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 0,
    margin: '0 4px',
    height: 104,
    width: 104,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <>
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
                        >
                        </UploadList>
                      </div>
                    )}
                  </Draggable>
                ))}
                <Upload
                  {...props}
                  fileList={fileList}
                  showUploadList={false}
                  onChange={onChange}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
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
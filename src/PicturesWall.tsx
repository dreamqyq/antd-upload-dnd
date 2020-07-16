import React, { CSSProperties, memo, useState } from 'react';
import UploadList from 'antd/es/upload/UploadList';
import { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle
} from 'react-beautiful-dnd';
import { UploadProps } from 'antd/lib/upload';

const getBase64 = (file: File | Blob | undefined): Promise<string> => {
  if (!file) return Promise.reject(new Error('no file'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file!);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const imagePreview = async (file: UploadFile, callback: (params: { image: string }) => void) => {
  const newFile = file;
  if (!newFile.url && !newFile.preview) {
    newFile.preview = await getBase64(file.originFileObj);
  }
  const newPreviewImage: string = newFile.url || newFile.preview || '';
  callback({
    image: newPreviewImage,
  });
};


const grid = 8;
const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid * 2,
  overflow: 'auto',
});
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): CSSProperties => ({
  userSelect: 'none',
  padding: 0,
  margin: '0 4px',
  height: 104,
  width: 104,
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
});

type Props = {
  onFileChange: (fileList: UploadFile[]) => void
} & UploadProps
const PicturesWall: React.FC<Props> = memo(({ onFileChange, ...props }) => {
  const [previewImage, setPreviewImage] = useState('');
  const fileList = props.fileList || [];

  type ChangeParams = {
    fileList: UploadFile[]
  }
  const onChange = ({ fileList }: ChangeParams) => {
    onFileChange(fileList);
  };

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(
      (item) => item.uid !== file.uid
    );
    onChange({ fileList: newFileList });
  };

  const reorder = (list: UploadFile[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = ({ source, destination }: DropResult) => {
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

  const onPreview = async (file: UploadFile) => {
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
        <img style={{ width: '100%' }} alt="" src={previewImage} />
      </Modal>
    </>
  );
});

export { PicturesWall };

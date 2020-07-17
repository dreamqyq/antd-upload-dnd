import React, { CSSProperties, memo, useState } from 'react';
import UploadList from 'antd/es/upload/UploadList';
import './picturWall.css';
import { UploadFile } from 'antd/es/upload/interface';
import { Modal, Upload } from 'antd';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle
} from 'react-beautiful-dnd';
import { UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { imagePreview } from '../../util/pictureUtil';


const grid = 8;
const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
  background: isDraggingOver ? 'lightblue' : '#f9f9f9',
  display: 'flex',
  flexWrap: 'wrap',
  padding: grid * 2,
  overflow: 'auto',
});
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): CSSProperties => ({
  userSelect: 'none',
  padding: 0,
  margin: 4,
  height: 104,
  width: 104,
  background: isDragging ? 'lightgreen' : '#f9f9f9',
  ...draggableStyle,
});
type Props = {
  onChange: (params: { fileList: UploadFile[] }) => void
} & UploadProps
const PicturesWall: React.FC<Props> = memo(({ onChange: onFileChange, ...props }) => {
  const [previewImage, setPreviewImage] = useState('');
  const fileList = props.fileList || [];

  const onChange = ({ fileList }: UploadChangeParam) => {
    onFileChange({ fileList });
  };

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(
      (item) => item.uid !== file.uid
    );
    onFileChange({ fileList: newFileList });
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
    onFileChange({ fileList: newFileList });
  };

  const onPreview = async (file: UploadFile) => {
    await imagePreview(file, ({ image }) => {
      setPreviewImage(image);
    });
  };

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
                          locale={{ previewFile: '预览图片', removeFile: '删除图片' }}
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
                <Upload
                  {...props}
                  fileList={fileList}
                  showUploadList={false}
                  onChange={onChange}
                >
                  {props.children}
                </Upload>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <Modal
        visible={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage('')}
        bodyStyle={{ padding: 0 }}
      >
        <img style={{ width: '100%' }} alt="" src={previewImage} />
      </Modal>
    </>
  );
});

export { PicturesWall };

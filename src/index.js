import React, { memo, useState } from "react";
import ReactDOM from "react-dom";
import UploadList from "antd/es/upload/UploadList";
import en_US from "antd/es/locale-provider/en_US";
import "antd/dist/antd.css";
import "./index.css";
import { Upload, Modal } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function cloneDeep(obj) {
  const objStr = JSON.stringify(obj);
  return JSON.parse(objStr);
}

const PicturesWall = memo(({ onChange: onChangeInitial, ...props }) => {
  const [fileList, setFileList] = useState();
  const [previewImage, setPreviewImage] = useState();

  const onChange = ({ fileList }) => {
    setFileList(fileList);
    onChangeInitial({ fileList });
  };

  const onRemove = file => {
    const newFileList = cloneDeep(fileList).filter(
      item => item.uid !== file.uid
    );
    onChange({ fileList: newFileList });
  };

  const onDragEnd = ({ source, destination }) => {
    const reorder = (list, startIndex, endIndex) => {
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

  const onPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
  };

  return (
    <>
      <Upload
        {...props}
        fileList={fileList}
        showUploadList={false}
        onChange={onChange}
      />
      {fileList && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {fileList.map((item, index) => (
                  <Draggable
                    key={item.uid}
                    draggableId={item.uid}
                    index={index}
                  >
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <UploadList
                          showDownloadIcon={false}
                          listType={props.listType}
                          onPreview={onPreview}
                          locale={en_US}
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
        visible={previewImage}
        width="60%"
        footer={null}
        onCancel={() => setPreviewImage(null)}
      >
        <img style={{ width: "100%" }} alt="" src={previewImage} />
      </Modal>
    </>
  );
});

ReactDOM.render(<PicturesWall />, document.getElementById("container"));

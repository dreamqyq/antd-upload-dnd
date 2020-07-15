import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UploadList from "antd/es/upload/UploadList";
import { PlusOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import { Upload, Modal } from "antd";
// fake data generator

const getBase64 = file => {
  if (!file) return Promise.reject(new Error("no file"));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
const imagePreview = async (file, callback) => {
  const newFile = file;
  if (!newFile.url && !newFile.preview) {
    newFile.preview = await getBase64(file.originFileObj);
  }
  const newPreviewImage = newFile.url || newFile.preview || "";
  callback({
    image: newPreviewImage
  });
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  overflow: "auto"
});

const Demo = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    },
    {
      uid: "-3",
      name: "image.png",
      status: "done",
      url:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    },
    {
      uid: "-4",
      name: "image.png",
      status: "done",
      url:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    }
  ]);
  const onChange = ({ fileList }) => setFileList(fileList);
  const onRemove = file => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    onChange({ fileList: newFileList });
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const onDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    const newItems = reorder(fileList, source.index, destination.index);
    onChange({ fileList: newItems });
  };
  const onPreview = async file => {
    await imagePreview(file, ({ image }) => {
      setPreviewImage(image);
    });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {fileList.map((item, index) => (
                <Draggable key={item.uid} draggableId={item.uid} index={index}>
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
                        listType="picture-card"
                        onPreview={onPreview}
                        onRemove={onRemove}
                        items={[item]}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              <Upload
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
      <Modal
        visible={!!previewImage}
        width="60%"
        footer={null}
        onCancel={() => setPreviewImage("")}
      >
        <img style={{ width: "100%" }} alt="" src={previewImage} />
      </Modal>
    </div>
  );
};

export default Demo;

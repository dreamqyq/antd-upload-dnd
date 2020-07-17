## 简介
图片上传，图片墙实现可拖拽排序效果。
- 基于 `react-beautiful-dnd` 实现的版本，可实现图片在同一行的拖拽排序效果，但是如果图片过多导致换行，该版本的效果就不尽如人意。
- 基于 `react-sortable-hoc` 实现的版本，可实现图片多行展示的拖拽排序效果，但是在具体细节方面的效果不如 `react-beautiful-dnd`。

## 预览
- `react-beautiful-dnd`
    
    ![预览](https://i.loli.net/2020/07/16/sFeBCEScNxJQ47w.gif)
- `react-sortable-hoc`
    
    ![预览](https://s1.ax1x.com/2020/07/17/Uy5hdK.gif)
    
## 技术栈
- 图片上传组件基于 [ant-design](https://github.com/ant-design/ant-design) 的 upload 组件。
- 图片拖拽排序效果基于 [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 或 [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) 

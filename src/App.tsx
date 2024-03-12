import "./App.less";
import { useEffect, useRef } from "react";

// import "./App.less";
const App = () => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const fileContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 拖拽物品进入容器时触发
    fileContainerRef.current?.addEventListener("dragenter", (e) => {
      e.preventDefault();
    });
    // 拖拽物品再容器上方时一直触发
    fileContainerRef.current?.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    // 拖拽物品离开容器时触发
    fileContainerRef.current?.addEventListener("dragleave", (e) => {
      e.preventDefault();
    });
    // 拖拽物品进入容器候松开左键后触发
    fileContainerRef.current?.addEventListener("drop", (e) => {
      e.preventDefault();
    });

    // 监听隐藏文件选择框的change事件，可以支持正常的选择文件
    hiddenInputRef.current?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      console.log(target.files);
    });
  }, []);

  // 容器的点击事件，委托成隐藏的文件选择框的点击事件
  const fileCOntainerClick = () => {
    hiddenInputRef.current?.click();
  };
  return (
    <div className="file" ref={fileContainerRef} onClick={fileCOntainerClick}>
      <div className="hidden-input" style={{ display: "none" }}>
        <input ref={hiddenInputRef} type="file" multiple />
      </div>
      {/* <div className="file-icon"></div> */}
      <div className="file-text">请选择文件上传或拖拽上传</div>
    </div>
  );
};

export default App;

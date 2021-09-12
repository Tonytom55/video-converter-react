import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const getFilesEndpoint = `http://localhost:5000/get-files`;
  const postFileEndpoint = `http://localhost:5000/send-file`;
  const [video, setVideo] = useState("");
  const [videoname, setVideoname] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setVideo(e.target.files[0]);
    setVideoname(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", video);

    try {
      const res = await axios.post(postFileEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(() => {
        getFiles()
        setMessage("Your file has been successfully converted to HLS format 😊. You can view your converted files below 👇")
      }, 3000)

      setTimeout(() => {
        setMessage("")
      }, 2000);

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage("Your file is successfully uploaded and now it's being processed, just wait for some time...");
    } catch (error) {
      setMessage(
        "Internal Server Error"
      );
    }
  };
  const [fileList, setFileList] = useState([]);
  const getFiles = async () => {
    const HLS = await axios.get(getFilesEndpoint);
    setFileList(HLS.data);
  }

  return (
    <>
      <div className="container m-5 text-center">
        <h1>Convert your .mp4 file name to HLS(.ts/.m3u8)</h1>
        <h6 className="text-warning">Make sure that your file dosen't have any white spaces.</h6>
        <h4 className="text-success">{message}</h4><br />
        <form onSubmit={onSubmit}>
          <div className="input-group mb-3 ">
            <div class="form-group container">
              <input
                type="file"
                accept="video/mp4"
                onChange={onChange}
                style={{ color: "white" }}
              />
            </div>
          </div>
          <div className="m-5">
            {video && (
              <div>
                <div className="text-centre mb-2">
                  <h5 className="text-white">{videoname}</h5>
                </div>
                <div className="m-50">
                  <div>
                    <video
                      controls
                      width="50%"
                      src={URL.createObjectURL(video)}
                    ></video>
                  </div>
                </div>
                <input
                  type="submit"
                  value="Upload"
                  className="btn btn-primary mt-3"
                  style={{ width: "50%" }}
                />
              </div>
            )}
          </div>
        </form>

        {
          fileList.length === 0 ? "" : <div className="m-5">
            <h3 className="mb-4">Converted Files 👇</h3>
            <ul class="list-group">
              {fileList.map((item, i) => {
                return (
                  <a href="#" class="list-group-item list-group-item-action">{item.fileName}</a>
                );
              })}
            </ul>

          </div>
        }
      </div>
    </>
  );
}

export default App;
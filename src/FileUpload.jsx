import { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined'
import { ViewPdf } from './ViewPdf';
import fileUploadGif from './assets/fileupload.gif';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import filenotFoundGif from './assets/filenotfound.gif'
import { Dialog } from 'primereact/dialog';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import L1 from './assets/recall.gif'
import L2 from './assets/understand.gif'
import L3 from './assets/apply.gif'
import Loading from './assets/loading.gif'

export default function TemplateDemo() {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [ file, setFile ] = useState(null);
    const [selected,setSelected]=useState([false,false,false])
    const [ isLoading, setIsLoading ] = useState(false);
    const[questions,setQuestions] = useState(null);
    const[isSelected,setisSelected]=useState(false);

    const questionTypes= [
        { name: 'Recall', code: '1', img: L1},
        { name: 'Understand', code: '2', img: L2},
        { name: 'Apply', code: '3', img: L3}
    ]

    const onTemplateSelect =async  (e) => {
        setFile(e.files[0]);
        setTotalSize(e.files[0].size);
    };

    const onTemplateUpload = async (e) => {
        
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
        setFile(null);
    };

    const onTemplateClear = () => {
        setFile(null);
        setTotalSize(0);
    };

    const truncateFilename=(filename, maxLength)=> {
        if (filename.length <= maxLength) {
            return filename;
        }
        const prefix = filename.substring(0, 9);
        const suffix = filename.substring(filename.length - 9);
        return prefix + "..." + suffix;
    };

    const handleCheckboxChange = () => {
        setisSelected(!isSelected);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = (fileUploadRef && fileUploadRef.current) ?  fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className + " header-template-box"}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div>
                    <span>{formatedValue!=='0 B'? formatedValue : ""}</span>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <i className='pi pi-file-pdf' style={{ fontSize: '1.5rem' }} />
                    <span className="file-name flex flex-column text-left ml-3">
                        {truncateFilename(file.name,21)}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>

                {
                    file.type === "application/pdf" && (
                        <div style={{ width: '20%', display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" id="ocrCheckbox" checked={isSelected} onChange={handleCheckboxChange} />
                            <label htmlFor="ocrCheckbox">OCR</label>
                        </div>
                    )
                }

                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <img src={fileUploadGif} style={{width:"12rem"}} alt={"File upload"} />
                <span className="empty-container" style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}>
                    Choose a PDF or video file 
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-file', label: 'Choose', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: <TroubleshootOutlinedIcon />, label: 'Analyze', iconOnly: false, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { className: 'custom-cancel-btn' };

    const uploadPdf =  () => {
        setVisible(true);
    }
    const handleSubmit=async ()=>{
        setVisible(false);
        setSelected(selected.map(() => false));
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        let response1 ,response2,response3;

        if(selected[0]){
            response1 = await axios.post('http://127.0.0.1:5000/generate-question-answers/remember', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } 

        if(selected[1]){
            response2 = await axios.post('http://127.0.0.1:5000/generate-question-answers/understand', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        }

        if(selected[2]){
            response3 = await axios.post('http://127.0.0.1:5000/generate-question-answers/apply', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        }
        
        let qa={};

        if(response1){
            qa['remember'] = response1.data;
        }
        else{
            qa['remember'] = {}
        }

        if(response2){
            qa['understand'] = response2.data;
        }
        else{
            qa['understand'] = {}
        }

        if(response3){
            qa['apply'] = response3.data;
        }
        else{
            qa['apply'] = {}
        }
        
        setIsLoading(false);
        return navigate('/display', { state: qa });
    }

    const footerContent = (
        <div>
            <Button
                className="check"
                label="Submit"
                icon="pi pi-check"
                onClick={handleSubmit}
                autoFocus
            />
        </div>
    );

    const handleClick=(idx)=>{
        const updatedState=selected;
        updatedState[idx]=!updatedState[idx]
        setSelected([...updatedState])
    }

    return (
        <>
            { !isLoading && (
                <div style={{display:"flex" ,width:"100%",padding:"0.5rem 2rem" }} >
                    <div className='centered-container' style={{ display: "flex", height: "auto", width: file?"40%":"50%" }}>
                        <FileUpload
                            className='file-upload-container'
                            ref={fileUploadRef}
                            style={{  width: file?"85%":"80%", borderRadius: '16px', padding: '10px', transition: file ? 'ease-in-out 1s' : 'none' }}
                            name="text"
                            customUpload
                            uploadHandler={uploadPdf}
                            accept={".pdf, .mp4"}
                            onUpload={onTemplateUpload}
                            onSelect={onTemplateSelect}
                            onError={onTemplateClear}
                            onClear={onTemplateClear}
                            headerTemplate={headerTemplate}
                            itemTemplate={itemTemplate}
                            emptyTemplate={emptyTemplate}
                            chooseOptions={chooseOptions}
                            uploadOptions={uploadOptions}
                            cancelOptions={cancelOptions}
                        />
                    </div>
                    <div className="vertical-line" style={{
                        borderLeft: '1px solid #B721FFF1', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', height:'80vh',marginLeft:'3rem'}}></div>
                        {file ?
                                <div className="pdf-viewer-container" style={{ flex: 1, marginLeft: '20px' ,width: "65%",transition:file?'ease-in-out 1s':'none'}}>
                                    {file?.type === 'application/pdf' && (
                                        <ViewPdf key={file.name} fileUrl={URL.createObjectURL(file)} />
                                    )}
                                    {file?.type === 'video/mp4' && (
                                    <Card component="li" sx={{ minWidth: 800, minHeight:500,flexGrow: 1 }}>
                                        <CardCover>
                                            <video
                                                autoPlay
                                                loop
                                                controls
                                                muted
                                                poster="https://assets.codepen.io/6093409/river.jpg"
                                            >
                                                <source src={URL.createObjectURL(file)} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </CardCover>
                                    </Card>
                                    )}
                                </div>:(
                                    <div className="notfound" style={{display:'flex',flexDirection:'column',justifyContent:'center', alignItems:'center',marginLeft: '20px', width: "55%" }}>
                                        <img src={filenotFoundGif} width="245px"/>
                                            <span className="empty-container my-5" style={{ fontSize: '1.8rem', color: 'var(--text-color-secondary)' }}>
                                                No File for Preview
                                            </span>
                                    </div>
                                )
                        }
                
                </div>
            )}
            <Dialog
                className="modal-qa-selection"
                header="Select Question Types"
                headerStyle={{ color: '#B721FFF1' }}
                visible={visible}
                style={{ width: '80vw', height: '70vh' }}
                onHide={() => {
                    setSelected(selected.map(() => false));
                    setVisible(false)
                }}
                footer={footerContent}
            >
                <div className="card-main-box">
                    {
                        questionTypes.map((card,idx) =>
                        <Card
                            sx={{
                                width:200,
                                height:200,
                                maxWidth: 515,
                                boxShadow: selected[idx] ? '0px 0px 8px 8px rgba(183, 33, 255, 0.4) ' : '0px 0px 4px rgba(0, 0, 0, 0.3)',
                                transition: 'box-shadow 0.3s ease-in-out',
                            }}
                            onClick={()=>handleClick(idx)}
                        >
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={card.img}
                                    alt="green iguana"
                                />
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        position: 'absolute',
                                        left:0,
                                        width: '100%',
                                        textAlign: 'center',
                                        fontWeight:550,
                                        padding:'8px',
                                        fontSize:'1.4rem'
                                    }}
                                >
                                    {card.name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                        )
                    }

                </div>
                
            </Dialog>
            
            {
                isLoading && (
                    <div className='centered-container'>
                        <div className="centered-sub-container">
                            <img src={Loading} alt="Loading image" width="545px" />
                            <span className="empty-container">
                                We are generating questions for you! Don&apos;t leave us yet.
                            </span>
                        </div>
                    </div>
                )
            }
        </>
    );
}
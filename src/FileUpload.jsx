import {useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
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
export default function TemplateDemo() {
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [ file, setFile ] = useState(null);
    const navigate = useNavigate();
    const [selected,setSelected]=useState([false,false,false])
    const [ isLoading, setIsLoading ] = useState(false);
    const[questions,setQuestions]=useState(null);
    const questionTypes=[
        { name:'Recall',code:'1',img:L1},
        {name:'Understand',code:'2',img:L2},
        {name:'Apply',code:'3',img:L3}
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
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = (fileUploadRef && fileUploadRef.current) ?  fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor:'white', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="upoader-header flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue!=='0 B'? formatedValue : ""}</span>
                    {/* <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar> */}
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <i className='pi pi-file-pdf' style={{ fontSize: '1.5rem' }} />
                    <span className="file-name flex flex-column text-left ml-3">
                        {truncateFilename(file.name,21)}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                {/* <i className="pi pi-file mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i> */}
                <img src={fileUploadGif} style={{width:"12rem"}}/>
                <span className="empty-container my-5" style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}>
                    Choose a PDF or video file 
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-file', label: 'Choose', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: <TroubleshootOutlinedIcon />, label: 'Analyze', iconOnly: false, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { className: 'custom-cancel-btn' };

    const uploadPdf = async () => {
        const formData = new FormData();
        formData.append('file', file);
        setVisible(true);
        //setIsLoading(true);
        
        // const response1 = await axios.post('http://127.0.0.1:5000/generate-brief-answer/1', formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data"
        //     }
        // });
        
        // const response2 = await axios.post('http://127.0.0.1:5000/generate-brief-answer/2', formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data"
        //     }
        // });
        
        // const response3 = await axios.post('http://127.0.0.1:5000/generate-brief-answer/3', formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data"
        //     }
        // });
        
        // const questions1 = response1.status === 200 ? response1.data.data.questions['question-answer'] : [];
        // const questions2 = response2.status === 200 ? response2.data.data.questions['question-answer'] : [];
        // const questions3 = response3.status === 200 ? response3.data.data.questions['question-answer'] : [];
        // const new_questions3 = [];
        
        // for (const questions of questions3) {
        //     if (questions.option.includes(questions.answer))
        //         new_questions3.push(questions);
        // }
        
        // setIsLoading(false);
        // return navigate('/qa', { state: [ ...questions1, ...questions2, ...new_questions3 ] })
    }
    const handleSubmit=()=>{
        console.log("Enter submit")
        setVisible(false);
        setSelected(selected.map(() => false));
        
    }
    const footerContent = (
        <div>
            <Button className="check" label="Submit" icon="pi pi-check" onClick={handleSubmit} autoFocus style={{ background:'#B721FF!important'}} />
        </div>
    );
    const handleClick=(idx)=>{
        console.log("Enter")
        const updatedState=selected;
        updatedState[idx]=!updatedState[idx]
        setSelected([...updatedState])

    }
    return (
        <>
            { !isLoading && (
                <div style={{display:"flex" ,width:"100%",padding:"0.5rem 2rem" }} >
                    <div className='centered-container' style={{ display: "flex", height: "auto", width: "30%" }}>
                        <FileUpload
                            className='file-upload-container'
                            ref={fileUploadRef}
                            style={{ width: "100%", borderRadius: '8px', padding: '10px' }}
                            name="text"
                            customUpload
                            uploadHandler={uploadPdf}
                            accept={".pdf, .mp4"}
                            // maxFileSize={10000000000}
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
                        {file ?
                                <div className="pdf-viewer-container" style={{ flex: 1, marginLeft: '20px' ,width:file?"65%":"50%"}}>
                                    {file?.type === 'application/pdf' && (
                                        <ViewPdf key={file.name} fileUrl={URL.createObjectURL(file)} />
                                    )}
                                    {file?.type === 'video/mp4' && (
                                    <Card component="li" sx={{ minWidth: 300, minHeight:500,flexGrow: 1 }}>
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
            <Dialog header="Select type of questions" headerStyle={{ color: '#B721FFF1' }} visible={visible} style={{ width: '80vw', height: '70vh' }} onHide={() => { setSelected(selected.map(() => false)); setVisible(false)}} footer={footerContent}>
                <div style={{display:'flex',flexDirection:'row',justifyContent:"space-around", alignContent:'center',marginTop:'1rem'}}>
                    {questionTypes.map((card,idx)=>
                        
                        <Card sx={{
                             width:200,
                             height:200,

                            maxWidth: 515, boxShadow: selected[idx] ? '0px 0px 8px 8px rgba(183, 33, 255, 0.7) ' : 'none',
                            transition: 'box-shadow 0.3s ease-in-out'
                        }} onClick={()=>handleClick(idx)}>
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
                                        color: '#B721FF',
                                        fontWeight:550,
                                        padding:'8px',
                                        fontSize:'1.4rem'
                                    }}
                                >
                                    {card.name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                )}
                    
                   
                </div>
            </Dialog>
            { isLoading && (
                <div className='centered-container'>
                    <ProgressSpinner />
                    <h2>We are generating questions for you! Don&apos;t leave us yet.</h2>
                </div>
            )}
        </>
    );
}
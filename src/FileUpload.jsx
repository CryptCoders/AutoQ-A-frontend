import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';

export default function TemplateDemo() {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [ file, setFile ] = useState(null);
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false);
    
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;
        setFile(e.files[0]);
        // Object.keys(files).forEach((key) => {
        //     _totalSize += files[key].size || 0;
        // });
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
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = (fileUploadRef && fileUploadRef.current) ?  fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
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
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-file mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span className="empty-container my-5" style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}>
                    Choose a .pdf or .mp4 file or drag and drop them here
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
        setIsLoading(true);

        const response1 = await axios.post('http://127.0.0.1:5000/generate-brief-answer/1', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        
        const response2 = await axios.post('http://127.0.0.1:5000/generate-brief-answer/2', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        
        const response3 = await axios.post('http://127.0.0.1:5000/generate-brief-answer/3', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        
        const questions1 = response1.status === 200 ? response1.data.data.questions['question-answer'] : [];
        const questions2 = response2.status === 200 ? response2.data.data.questions['question-answer'] : [];
        const questions3 = response3.status === 200 ? response3.data.data.questions['question-answer'] : [];
        const new_questions3 = [];
        
        for (const questions of questions3) {
            if (questions.option.includes(questions.answer))
                new_questions3.push(questions);
        }
        
        // console.log(response.data.data);
        setIsLoading(false);
        return navigate('/qa', { state: [ ...questions1, ...questions2, ...new_questions3 ] })
    }

    return (
        <>
            { !isLoading && (
                <div className='centered-container'>
                    <Toast ref={toast}></Toast>

                    <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                    <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                    <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                    <FileUpload
                        className='file-upload-container'
                        ref={fileUploadRef}
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
            )}

            { isLoading && (
                <div className='centered-container'>
                    <ProgressSpinner />
                    <h2>We are generating questions for you! Don&apos;t leave us yet.</h2>
                </div>
            )}
        </>
    );
}
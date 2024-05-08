import { useState, useRef } from 'react';
import { usePdf } from '@mikecousins/react-pdf';

export const ViewPdf = ({ fileUrl }) => {
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);

    const pdfDocument = usePdf({
        file: fileUrl,
        page: page,
        canvasRef: canvasRef
    });

    const goToPreviousPage = () => {
        setPage(page => Math.max(page - 1, 1)); // Ensure page doesn't go below 1
    };

    const goToNextPage = () => {
        setPage(page => Math.min(page + 1, pdfDocument?.pdfDocument?.numPages || 1)); // Ensure page doesn't exceed total number of pages
    };

    return (
        <>
            {pdfDocument && (
                <>
                    <div style={{ maxHeight: '40rem', overflowY: 'auto' }}>
                        <canvas ref={canvasRef} style={{ display: 'block', margin: 'auto' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <button
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                            style={{ marginRight: '10px', backgroundColor: 'transparent', border: 'none' }}
                        >
                            <i className="pi pi-step-backward" style={{ color: 'slateblue', fontSize: '1.5rem' }}></i>
                        </button>

                        <button
                            onClick={goToPreviousPage}
                            disabled={page === 1}
                            style={{ marginRight: '10px', backgroundColor: 'transparent', border: 'none' }}
                        >
                            <i className="pi pi-caret-left" style={{ color: 'slateblue', fontSize: '1.5rem' }}></i>
                        </button>

                        <span style={{ fontSize: '16px',fontStyle:'normal' }}>{page}/{pdfDocument?.pdfDocument?.numPages || '...'}</span>

                        <button
                            onClick={goToNextPage}
                            disabled={page === (pdfDocument?.pdfDocument?.numPages || 1)}
                            style={{ marginLeft: '10px', backgroundColor: 'transparent', border: 'none' }}
                        >
                            <i className="pi pi-caret-right" style={{ color: 'slateblue', fontSize: '1.5rem' }}></i>
                        </button>

                        <button
                            onClick={() => setPage(pdfDocument?.pdfDocument?.numPages || 1)}
                            disabled={page === (pdfDocument?.pdfDocument?.numPages || 1)}
                            style={{ marginLeft: '10px', backgroundColor: 'transparent', border: 'none' }}
                        >
                            <i className="pi pi-step-forward" style={{ color: 'slateblue', fontSize: '1.5rem' }}></i>
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

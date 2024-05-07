import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import Typography from '@mui/material/Typography';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TextArea from '@mui/material/TextareaAutosize';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Highlighter from 'react-highlight-words';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import filenotFoundGif from "./assets/filenotfound.gif";
import NotFound from "./NotFound.jsx";
import { formatQuestion, formatAnswer } from "./service/format.js";

export default function PaperFormat({ qaData }) {
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(3);
	
	const [visible, setVisible] = useState(false);
	const [modalContent, setModalContent] = useState(<></>);
	const [ checkAnswer, setCheckAnswer ] = useState([]);
	const [score, setScore] = useState(undefined);
	const [copy, setCopy] = useState(false);
	const [highlight, setHighlight] = useState([]);
	
	const toast = useRef(null);
	
	const handleEvaluate = async () => {
		setScore(0);
		
		const response = await axios.post('http://127.0.0.1:5000/evaluate-answer', {
			desired_answer: checkAnswer[0],
			user_answer: checkAnswer[1]
		}, {
			headers: {
			"Content-Type": "application/json"
			}
		});
		
		setScore(response?.data?.score);
	};
	
	const showCopied = () => {
		toast.current.show({ severity: 'info', summary: 'Success', detail: 'Content Copied!' });
	}
	
	return (
		<div className="qa-format1-container">
			<>
				{ qaData && Object.keys(qaData).length ? (
					<>
						<ul className="qa-format1">
							{
								qaData.slice(first, first + rows).map((qaPair, idx) => {
									return (
										<li className="qa-format1-list" key={first + idx}>
											<div className="qa-format-question-container">
												<div className="qa-format1-question">
													{first + idx + 1}. {formatQuestion(qaPair.question)}
												</div>

												<div className="qa-format1-evaluate">
													<button
														className="qa-format1-evaluate-btn"
														onClick={() => {
															setScore(0);
															setCheckAnswer([qaPair.answer, '']);
															setVisible(true);
															setModalContent(
																<div className="modal-container">
																	<TextArea
																		className="modal-answer"
																		minRows={ 9 }
																		placeholder={ "Write your answer here..." }
																		onChange={ (e) => {
																			setCheckAnswer([qaPair.answer, e.target.value])
																		}}
																	/>
																</div>
															)
														}}
													>
														Evaluate
													</button>
												</div>
											</div>

											<div className="qa-format1-answer">
												<span style={{fontWeight: 600}}>Answer: </span>
												<Highlighter
													key={first + idx}
													searchWords={ highlight.includes(first + idx) ? qaPair.keywords : [] }
													textToHighlight={formatAnswer(qaPair.answer)}
												/>

												{/*<span>{qaPair.answer}</span>*/}
												<div
													className="qa-format1-copy"
												>
													<ContentCopyOutlinedIcon
														className="qa-format1-copy-icon"
														onClick={(e) => {
															showCopied();
															navigator.clipboard.writeText(qaPair.answer);
															setCopy(true);
															setTimeout(() => setCopy(false), 1500);
														}}
													/>
													<Toast ref={toast} className="toast" />
													{/*<div className={ copy ? "tooltip-copy" : "tooltip-not-copy" }>Copied!</div>*/}
												</div>
											</div>

											{ qaPair.keywords && (
												<Accordion
													key={first + idx}
													multiple={true}
												>

													<AccordionTab
														key={first + idx}
														className="accordion-tab"
														header="Keywords"
														onClick={(e) => {
															highlight.includes(first + idx) ?
																setHighlight(highlight.filter(ele => ele !== first + idx)):
																setHighlight([...highlight, first + idx])
														}}
													>
														<ul className="qa-format1-keyword">
															{
																qaPair.keywords.map((keyword, idx) => {
																	return (
																		<li className="qa-format1-keyword-li" key={idx}>{keyword}</li>
																	)
																})
															}
														</ul>
													</AccordionTab>
												</Accordion>
											)}
											<Divider/>
										</li>
									)
								})
							}
						</ul>

						<Paginator
							className="paginator"
							first={first}
							rows={rows}
							totalRecords={qaData.length}
							rowsPerPageOptions={[3, 5]}
							onPageChange={(e) => {
								setFirst(e.first);
								setRows(e.rows);
								setHighlight([]);
							}}
						/>
					</>
				) : <NotFound/>
				}

				<Dialog
					className="modal-main-container"
					visible={visible}
					header="Provide your answer, we'll evaluate it for you!"
					onHide={() => {
						setVisible (false);
						setCheckAnswer([]);
						setScore(undefined);
					}}
				>
					{modalContent}

					{
						score === undefined ? (
							<Typography
								className="modal-evaluate-text"
								variant="h5"
								component="h5"
								style={{
									color: '#B14BF4'
								}}
							>
								We have evaluated your answer to be: {score}/10
							</Typography>
						) : (
							<Button
								className="modal-evaluate-btn"
								icon="pi pi-verified"
								label="Evaluate"
								onClick={handleEvaluate}
							/>
						)
					}
				</Dialog>
			</>
		</div>
	);
}


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
import CircularProgress from '@mui/material/CircularProgress';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Highlighter from 'react-highlight-words';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import filenotFoundGif from "./assets/filenotfound.gif";
import NotFound from "./NotFound.jsx";
import { formatQuestion, formatAnswer,formatKeyword } from "./service/format.js";

export default function PaperFormat({ qaData, level }) {
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(3);
	
	const [visible, setVisible] = useState(false);
	const [modalContent, setModalContent] = useState(<></>);
	const [ checkAnswer, setCheckAnswer ] = useState([]);
	const [score, setScore] = useState(undefined);
	const [scoreLoading, setScoreLoading] = useState(false);
	const [copy, setCopy] = useState(false);
	const [highlight, setHighlight] = useState([]);
	
	const toast = useRef(null);
	
	const handleEvaluate = async () => {
		setScore(undefined);
		setScoreLoading(true);

		const response = await axios.post('http://127.0.0.1:5000/evaluate-answer', {
			question: checkAnswer[0],
			desired_answer: checkAnswer[1],
			user_answer: checkAnswer[2]
		}, {
			headers: {
				"Content-Type": "application/json"
			}
		});

		setScoreLoading(false);
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

												{
													level !== "remember" && (
														<div className="qa-format1-evaluate">
														<button
															className="qa-format1-evaluate-btn"
															onClick={() => {
																setScore(undefined);
																setCheckAnswer([qaPair.question, qaPair.answer, '']);
																setVisible(true);
																setModalContent(
																	<div className="modal-container">
																		<TextArea
																			className="modal-answer"
																			minRows={ 9 }
																			placeholder={ "Write your answer here..." }
																			onChange={ (e) => {
																				setCheckAnswer([qaPair.question, qaPair.answer, e.target.value]);
																			}}
																		/>
																	</div>
																)
															}}
														>
														Evaluate
													</button>
												</div>
													)}
											</div>

											<div className="qa-format1-answer">
												<span style={{fontWeight: 600}}>Answer: </span>
												{/* <Highlighter
													key={first + idx}
													searchWords={ highlight.includes(first + idx) ? qaPair.keywords : [] }
													textToHighlight={formatAnswer(qaPair.answer)}
												/> */}

												<span>{formatAnswer(qaPair.answer)}</span>
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
																qaPair?.keywords?.map((keyword, idx) => {
																	return (
																		<li className="qa-format1-keyword-li" style={{listStyleType:'none'}} key={idx}>{formatKeyword(keyword)}</li>
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
				) : <NotFound/> }

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
						<>
							<Typography
								className="modal-evaluate-text"
								variant="h5"
								component="h5"
								style={{
									color: '#B14BF4'
								}}
							>
								{ score === 0 || !isNaN(score) ?
									`We have evaluated your answer to be: ${ score }/10` :
									`We have yet to evaluate your answer!`
								}
							</Typography>

							<Button
								style={{ width: '9rem', height: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
								className="modal-evaluate-btn"
								icon={!scoreLoading ? "pi pi-verified" : "" }
								label={!scoreLoading ? "Evaluate" : "" }
								onClick={handleEvaluate}
							>
								{ scoreLoading ? <CircularProgress style={{ width: '2rem', height: '2rem', color: 'white' }} /> : <></> }
							</Button>
						</>
					}
				</Dialog>
			</>
		</div>
	);
}


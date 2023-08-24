import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';


export const ACTIONS = {
  ADD_NUMBER: 'add-number',
  ADD_OPERATION: 'add-operation',
  ClEAR: 'clear',
  DELETE: 'delete',
  CALCULATE: 'calculate'

}

function calculateNewValue({prev, curr, operation}) {
  if (operation === "+")
	return parseFloat(prev) + parseFloat(curr)
  if (operation === "-")
	return parseFloat(prev) - parseFloat(curr)
  if (operation === "x")
	return parseFloat(prev) * parseFloat(curr)
  if (operation === "÷" && curr !== "0")
	return parseFloat(prev) / parseFloat(curr)
  else
	return "Math Error"


}

function reducer(state, {type ,payload}) {
  switch(type) {
	case ACTIONS.ADD_NUMBER:
	  if (state.overwrite){
		console.log("overwrite")
		return {
		  ...state,
		  curr: payload.digit,
		  overwrite: false,
		}
	  }
	  if ((state.curr === "0" && payload.digit === "0"))
		return state
	  if ((payload.digit === "." && state.curr.includes(".")))
		 return state
	  return {
		...state,
		curr: `${state.curr || ""}${payload.digit}`
	  }
	case ACTIONS.ADD_OPERATION:
	  if (state.curr == null && state.prev == null){
		return state;
	  }
	  if (state.curr == null){
		return {
		  ...state,
		  operation: payload.operation,
		}
	  }
	  if (state.prev == null){
		return {
		  ...state,
		  operation: payload.operation,
		  prev: state.curr,
		  curr: null,
		}
	  }
	  else
	  {
		return {
		  ...state,
		  prev: calculateNewValue(state),
		  operation: payload.operation,
		  curr: null,
		}
	  }
	case ACTIONS.ClEAR:
	  return {};
	case ACTIONS.DELETE:
	  if (state.overwrite){
		return {
		  ...state,
		  overwrite: false,
		  curr: null,
		}
	  }
	  if (state.curr == null || state.curr.length === 1){
		return {
			...state,
			curr: null,
		}
	  }
	  return {
		...state,
		curr: state.curr.slice(0, -1),
	  }
	case ACTIONS.CALCULATE:
	  if (state.curr == null || state.prev == null || state.operation == null){
		return state;
	  }
	  return {
		...state,
		curr: calculateNewValue(state),
		overwrite: true,
		prev: null,
		operation: null,
	  }
	default:
	  return {}
  }
}

const integerFomat = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 0,
});

function formating(value) {
	if (value == null)
		return ""
  if (value === "Math Error")
	return value
  if (value.toString().includes("."))
	return value.toString()
  else
	return integerFomat.format(value)
}

function App() {

	const [{curr, prev, operation}, dispatch] = useReducer(reducer, {})

	// dispatch({type: ACTIONS.ADD_NUMBER, payload: {digit: 1}})

  return (
	<div className="App">
	  <div className='output'>
		<div className='pre-operand'>{formating	(prev)} {operation}</div>
		<div className='curr-operand'>{formating	(curr)}</div>
	  </div>
	  <button className='span-two' onClick={()=> dispatch({ type: ACTIONS.ClEAR})}>AC</button>
	  <button onClick={()=> dispatch({ type: ACTIONS.DELETE})}>DEL</button>
	  {/* <button onClick={()=> { console.log("÷")}}>÷</button> */}
	  <OperationButton dispatch={dispatch} operation="÷"/>
	  <DigitButton dispatch={dispatch} digit="7" />
	  <DigitButton dispatch={dispatch} digit="8" />	
	  <DigitButton dispatch={dispatch} digit="9" />
	  <OperationButton dispatch={dispatch} operation="x"/>
	  <DigitButton dispatch={dispatch} digit="4" />
	  <DigitButton dispatch={dispatch} digit="5" />
	  <DigitButton dispatch={dispatch} digit="6" />
	  <OperationButton dispatch={dispatch} operation="+"/>
	  <DigitButton dispatch={dispatch} digit="1" />
	  <DigitButton dispatch={dispatch} digit="2" />
	  <DigitButton dispatch={dispatch} digit="3" />
	  <OperationButton dispatch={dispatch} operation="-"/>

	  <DigitButton dispatch={dispatch} digit="." />
	  <DigitButton dispatch={dispatch} digit="0" />
	  <button className='span-two1' onClick={()=> dispatch({ type: ACTIONS.CALCULATE })}>=</button>

	</div>
  );
}

export default App;

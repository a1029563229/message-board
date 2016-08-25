import './index.less';
let React = require('react');
let ReactDOM = require('react-dom');

let World = React.createClass({
    render(){
        return (
            '<span>World is beautiful!Yes...!</span>'
        )
    }
})

let Hello = React.createClass({
    render(){
        return(
            '<div>' + 
                '<h1>Hello,boy!</h1>' + 
                '<World />' + 
            '</div>'
        )
    }
})

ReactDOM.render(
  <Hello />, 
  document.getElementById("test")
);
import {CSSProperties, ReactElement} from 'react';
import ReactCodeMirror from '@uiw/react-codemirror';
import {xml} from '@codemirror/lang-xml';
import {EditorView} from 'codemirror';

interface IProps {
  style?: CSSProperties;
  source: string;
  onChange: (value: string) => void;
}

export function XmlSourceEditor({style, source, onChange}: IProps): ReactElement {
  return (
    <ReactCodeMirror className="xml-source-editor" style={style} extensions={[xml(), EditorView.lineWrapping]} value={source} onChange={onChange}/>
  );
}
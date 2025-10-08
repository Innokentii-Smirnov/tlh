import {inputClasses, XmlEditableNodeIProps, XmlSingleInsertableEditableNodeConfig} from '../editorConfig';
import {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {LanguageInput} from '../LanguageInput';
import {findFirstXmlElementByTagName, xmlElementNode} from 'simple_xml';
import {AOption} from '../../myOption';
import classNames from 'classnames';
import {selectedNodeClass} from '../tlhXmlEditorConfig';

type clbAttrs = 'id' | 'lg';

export const clbNodeConfig: XmlSingleInsertableEditableNodeConfig<'clb', clbAttrs> = {
  replace: ({node, isSelected}) => <span className={classNames(isSelected ? selectedNodeClass : 'bg-amber-500')}>{node.attributes.id}&nbsp;</span>,
  edit: (props) => <ClbEditor {...props}/>,
  insertablePositions: {
    beforeElement: ['w', 'parsep', 'parsep_dbl'],
    afterElement: ['w'],
    newElement: () => xmlElementNode('clb', {id: 'CLB'})
  }
};

function ClbEditor({node, updateAttribute, setKeyHandlingEnabled, rootNode}: XmlEditableNodeIProps<'clb', clbAttrs>): JSX.Element {

  const {t} = useTranslation('common');

  const textLanguage = AOption.of(findFirstXmlElementByTagName(rootNode, 'text'))
    .map((textElement) => textElement.attributes['xml:lang'])
    .get();

  return (
    <>
      <label htmlFor="id" className="font-bold">{t('id')}:</label>
      <input type="text" id="id" className={inputClasses} defaultValue={node.attributes.id?.trim()} onFocus={() => setKeyHandlingEnabled(false)}
             onBlur={() => setKeyHandlingEnabled(true)} onChange={(event) => updateAttribute('id', event.target.value)}/>
      <div className="mb-4">
          <LanguageInput initialValue={node.attributes.lg} parentLanguages={{text: textLanguage}} onChange={(value) => updateAttribute('lg', value)}/>
      </div>
    </>
  );
}
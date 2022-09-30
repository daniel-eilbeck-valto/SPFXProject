import * as React from 'react';
import styles from './Crudwithreact.module.scss';
import { ICrudwithreactProps } from './ICrudwithreactProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISoftwareListItem } from './ISoftwareListItem';
import { ICrudWithReactState } from './ICrudWithReactState';

import {ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import {
  TextField,
  //autobind,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
  Dropdown,
  IDropdown,
  IDropdownOption,
  ITextFieldStyles,
  IDropdownStyles,
  DetailsRowCheck,
  Selection
} from 'office-ui-fabric-react';


//Configure the columns for the DetailsList component
let _softwareListColumns = [
  {
    key: 'ID',
    name: 'ID',
    fieldName: 'ID',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true
  },
  {
    key: 'Title',
    name: 'Title',
    fieldName: 'Title',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true
  },
  {
    key: 'SoftwareName',
    name: 'SoftwareName',
    fieldName: 'SoftwareName',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true
  },
  {
    key: 'SoftwareVendor',
    name: 'SoftwareVendor',
    fieldName: 'SoftwareVendor',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true
  },
  // {
  //   key: 'SoftwareVersion',
  //   name: 'SoftwareVersion',
  //   fieldName: 'SoftwareVersion',
  //   minWidth: 50,
  //   maxWidth: 150,
  //   isResizable: true
  // },
  // {
  //   key: 'SoftwareDescription',
  //   name: 'SoftwareDescription',
  //   fieldName: 'SoftwareDescription',
  //   minWidth: 50,
  //   maxWidth: 100,
  //   isResizable: true
  // }
];

const textFieldStyles: Partial<ITextFieldStyles> = {fieldGroup: {width:300}};
const narrowTextFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: {width:100}};
const narrowDropDownStyles: Partial<IDropdownStyles> = {dropdown: {width:300}};

export default class Crudwithreact extends React.Component<ICrudwithreactProps, ICrudWithReactState> {

  private _selection: Selection;

  private _onItemsSelectionChanged = () => {
    this.setState({
      SoftwareListItem: (this._selection.getSelection()[0] as ISoftwareListItem)
    });
  }

  constructor(props: ICrudwithreactProps, state: ICrudWithReactState) {
    super(props);

    this.state = {
      status: 'Ready',
      SoftwareListItems: [],
      SoftwareListItem: {
        Id: 0,
        Title: "",
        SoftwareName: "",
        //SoftwareDescription: "",
        SoftwareVendor: "Select an option",
        //SoftwareVersion: ""
      }
    };
    this._selection = new Selection({
      onSelectionChanged: this._onItemsSelectionChanged,
    });
  }

  //ISoftwareListitem array as a promise. Build url 
  private _getListItems(): Promise<ISoftwareListItem[]> {
    const url: string = this.props.siteURL + "/_api/web/lists/getbytitle('Software')/items";
    return this.props.context.spHttpClient.get(url,SPHttpClient.configurations.v1)
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json.value;
    }) as Promise<ISoftwareListItem[]>
  }

  public bindDetailsList(message: string) : void {
    this._getListItems().then(ListItems => {
      this.setState({SoftwareListItems: ListItems, status: message})
    });
  }

  public componentDidMount(): void {
    this.bindDetailsList("All Records have been loaded Successfully");
  }

  public btnAdd_click(): void {
    const url: string = this.props.siteURL + "/_api/web/lists/getbytitle('Software')/items";
    console.log(url)
    console.log("hello")
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(this.state.SoftwareListItem)
    }
    this.props.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.status === 201) {
        this.bindDetailsList('Record added and All Records were loaded Successfully')
      } else {
        let errormessage: string = "An error has occured i.e. " + response.status + " - " + response.statusText;
        this.setState({status: errormessage})
      }
    })
  };

  private _onChangedTitle = (title: string) => {
    this.setState({
      SoftwareListItem: {
        Title: title,
        Id: this.state.SoftwareListItem.Id,
        SoftwareName: this.state.SoftwareListItem.SoftwareName,
        SoftwareVendor: this.state.SoftwareListItem.SoftwareVendor,
        //SoftwareVersion: this.state.SoftwareListItem.SoftwareVersion,
        //SoftwareDescription: this.state.SoftwareListItem.SoftwareDescription,
      },
    });
  };

  private _onChangedName = (Name: string) => {
    this.setState({
      SoftwareListItem: {
        SoftwareName: Name,
        Id: this.state.SoftwareListItem.Id,
        SoftwareVendor: this.state.SoftwareListItem.SoftwareVendor,
        Title: this.state.SoftwareListItem.Title
      },
    });
  };

  // private _ID = (Id: String) => {
  //   this.setState({
  //     SoftwareListItem: {
  //       Id: Id,
  //       SoftwareName: this.state.SoftwareListItem.SoftwareName,
  //       SoftwareVendor: this.state.SoftwareListItem.SoftwareVendor,
  //       Title: this.state.SoftwareListItem.Title
  //     },
  //   });
  // };

  
//   public render(): React.ReactElement<ICrudwithreactProps> {
//     const {
//       description,
//       isDarkTheme,
//       environmentMessage,
//       hasTeamsContext,
//       userDisplayName
//     } = this.props;
//     const dropdownRef = React.createRef<IDropdown>();
//     return (
//       <div className={styles.welcome}>
//       <TextField
//           label="ID"
//           required={false}
//           value={(this.state.SoftwareListItem.Id).toString()}
//           styles={textFieldStyles}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.Id = Number(e.target.value)}}
//         />

//         <TextField
//           label="Software Name"
//           required={true}
//           value={(this.state.SoftwareListItem.SoftwareName)}
//           styles={textFieldStyles}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.SoftwareName = e.target.value}}
//         />
//         <div>
//         <div id="divStatus">
//            {this.state.status}
//         </div>
//         {this.state?.SoftwareListItems && this.state.SoftwareListItems && this.state.SoftwareListItems.length > 0 && 
//         <DetailsList
//         items={ this.state.SoftwareListItems }//this.state.SoftwareListItems }
//         columns={_softwareListColumns}
//         setKey='Id'
//         checkboxVisibility={ CheckboxVisibility.onHover}
//         selectionMode={ SelectionMode.single}
//         layoutMode={DetailsListLayoutMode.fixedColumns}
//         compact={true}
//         selection={this._selection}
//       />
//         } 
//       </div>
//       </div>
//       //</section>
//     );
//   }
// }
  public render(): React.ReactElement<ICrudwithreactProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;
    const dropdownRef = React.createRef<IDropdown>();

    return(
      <div className={styles.crudwithreact}>

        {/* <TextField
          label="ID"
          required={false}
          value={(this.state.SoftwareListItem.Id).toString()}
          styles={textFieldStyles}
          onChanged={e => {this.state.SoftwareListItem.Id=e}}
        /> */}
        <TextField
          label="ID"
          required={false}
          value={(this.state.SoftwareListItem.Id).toString()}
          styles={textFieldStyles}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.Id = Number(e.target.value)}}
        />
        <TextField
          label="Software Title"
          required={true}
          value={(this.state.SoftwareListItem.Title)}
          styles={textFieldStyles}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => this._onChangedTitle(e.target.value)}
          //onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.Title = e.target.value}}
        />
        
        <TextField
          label="Software Name"
          required={true}
          value={(this.state.SoftwareListItem.SoftwareName)}
          styles={textFieldStyles}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => this._onChangedName(e.target.value)}
          //onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.SoftwareName = e.target.value}}
        />
        {/* <TextField
          label="Software Vendor"
          required={false}
          value={(this.state.SoftwareListItem.SoftwareVendor)}
          styles={textFieldStyles}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.SoftwareVendor = e.target.value}}
        /> */}
        {/* <TextField
          label="Software Version"
          required={true}
          value={(this.state.SoftwareListItem.SoftwareVersion)}
          styles={textFieldStyles}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.SoftwareVersion= e.target.value}}
        /> */}
        {/* <TextField
          label="Software Description"
          required={true}
          value={(this.state.SoftwareListItem.SoftwareDescription)}
          styles={textFieldStyles}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.state.SoftwareListItem.SoftwareName = e.target.value}}
        /> */}
        {/* <Dropdown
        componentRef={dropdownRef}
        placeholder="Select an option"
        label="Software Vendor"
        options={[
          {key: 'Microsoft', text: 'Microsoft'},
          {key: 'Sun', text: 'Sun'},
          {key: 'Oracle', text: 'Oracle'},
          {key: 'Google', text: 'Google'}
        ]}
        defaultSelectedKey={this.state.SoftwareListItem.SoftwareVendor}
        required={false}
        styles={narrowDropDownStyles}
        onChanged={e => {this.state.SoftwareListItem.SoftwareVendor=e.text}}
        /> */}
        <p className={styles.welcome}>
          <PrimaryButton
            text='Add'
            title='Add'
            onClick={this.btnAdd_click}
          />
          {/* <PrimaryButton
            text='Update'
            onClick={this.btnUpdate_click}
          />
          <PrimaryButton
            text='Delete'
            onClick={this.btnDelete_click}
          /> */}
          </p>
          <div id="divStatus">
            {this.state.status}
          </div>

      <div>
      {this.state?.SoftwareListItems && this.state.SoftwareListItems && this.state.SoftwareListItems.length > 0 && 
        <DetailsList
          items={ this.state.SoftwareListItems }
          columns={_softwareListColumns}
          setKey='Id'
          checkboxVisibility={ CheckboxVisibility.onHover}
          selectionMode={ SelectionMode.single}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          compact={true}
          selection={this._selection}
        />
      }
      </div>
      </div>
    );
    
  }
}

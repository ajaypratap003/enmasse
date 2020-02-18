import {useEffect,useState} from "react";
import {useMutation } from "@apollo/react-hooks";
import {ApolloError,OperationVariables} from "apollo-client";

import {useErrorContext,SET_SERVER_ERROR} from "context-state-reducer";

export const useMutationQuery=(query:any,callbackOnError?:Function,callbackOnCompleted?:Function)=>{
    const [variables,setVariables]=useState<OperationVariables>();  
    const {dispatch}=useErrorContext();  

    const [addVariables]=useMutation(query,{
        onError(error:ApolloError){         
          callbackOnError && callbackOnError(error);
          dispatch({type:SET_SERVER_ERROR,payload:error});
        },
        onCompleted(data:any){
          callbackOnCompleted && callbackOnCompleted(data);
        }
      });

    useEffect(()=>{
        async function executeQuery(){
            if(variables){
             await addVariables({variables});             
            } 
        }
        executeQuery();
              
    },[variables,query]);       
    return [setVariables];
};
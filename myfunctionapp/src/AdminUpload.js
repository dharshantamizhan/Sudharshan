import React, { useState,useEffect } from 'react';
import moment from"moment";
import axios from 'axios';
const AdminUpload = (props) => {
    const [Details, setDetails] = useState({
        StudentName:'',StudentEmail:'',StudentDOB:''
      });
  const [updatedetails,setupdatedetails] = useState([]);
      const [studentDetails, setStudentDetails] = useState([]);
      const [page,setpage]=useState(1);
      const [errors, setErrors] = useState({
        name: '',
        email: '',
        dob: '',
        files: '',
      });
      const [updatebtn,setUpdatebtn]=useState(false);

      const [simage, setSimage] = useState([]);
      const [usimage,setusimage] = useState([]);

     const handleView = ()=>{
      setpage(2);
     } 
     const backtoform  = ()=>{
      setpage(1);
      setUpdatebtn(false);
     } 
     console.log(page,"page");
    // const [isStudentName,isSetStudentName] = useState(false);
    // const [isStudentEmail,isSetStudentEmail] = useState(false);
    // const [isStudentDOB,isSetStudentDOB] = useState(false);
//  const validation =  ()=>{
// if(Details.StudentName.length>0){
//   console.log("entered name");
//   isSetStudentName(true);
// }
//  if(Details.StudentEmail.length>0)
// {
//   console.log("entered email");
// isSetStudentEmail(true);
// }
//  if(Details.StudentDOB.length>0)
// {
//   console.log("entered dob");
//   isSetStudentDOB(true);
// }

//  }
useEffect(() => {
const fetchData = async () => {
  try {
    await axios.get('http://localhost:4000/get/viewdetails')
    .then(res => {
        console.log(res.data, "resss")
        let resdata = res.data;
        for (let i = 0; i < resdata.length; i++) {
            res.data[i].Simage = JSON.parse(res.data[i].Simage);
            // console.log(imges[i], "imges")
        }
        // console.log(imges, "imges after")
        setStudentDetails(res.data);
    })
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
fetchData();
}, []); 
// edit
const handleEdit = async(Sno,Editdata)=>{
  // console.log(Editdata,"data",Sno,"sno");
 await setupdatedetails(Editdata);
 await setpage(1);
 await setUpdatebtn(true);

console.log(updatedetails,"updatedetails");
}
// update to db 
const UpdateSubmit = async (e)=>{
  e.preventDefault();
  // console.log(updatedetails,"updatedetails");
  // console.log(usimage,"usimages");
  let photo =[];
photo = usimage.Simage;
// console.log(photo,"photo");
// console.log(photo.length,"photo.length");
  
const Udata = new FormData();
Udata.append("id",updatedetails.id)
Udata.append("StudentName",updatedetails.StudentName);
Udata.append("StudentEmail",updatedetails.StudentEmail);
Udata.append("StudentDOB",updatedetails.StudentDOB);

for (let i = 0; i < photo.length; i++) {
  Udata.append("file", photo[i])
}
console.log(Udata,"udata");
if(errors.name===""&&errors.email===""&&errors.dob===""&&errors.files==="")
{
 try {
   let Updatedata= await axios.post('http://localhost:4000/post/updated',Udata)
  console.log(Updatedata,"Updatedata");
  if(Updatedata.data==="updated")
  {
      alert("Update Successfully")
      window.location.reload();
      await setpage(2);
      
  }
  else{
      alert("something went wrong warning :)")
  }
 } catch (error) {
  console.log(error,"ueror");
 }
}
else{
  alert("Must be Required all Field")
}


}

// handle update change
const handleUpdate  = async (e)=>{
    const name =e.target.name;
    const value = e.target.value;
    const files=e.target.files;
    console.log(name,"name");
    console.log(value,"value");
    console.log(files,"files");
      if (files!==null) {
        setusimage({[name]:files});
        console.log(usimage,"usimages");
      }
      setupdatedetails({ ...updatedetails, [name]: value });
    
    if (name === 'StudentName') {
      if (value.trim() === '') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: 'Name is required',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: '',
        }));
      }
    } else if (name === 'StudentEmail') {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Invalid email format',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '',
        }));
      }
    } else if (name === 'StudentDOB') {
      const now = moment();
// console.log(now,"now");
const dob = moment(updatedetails.StudentDOB, 'YYYY-MM-DD');
// console.log(dob,"dob");
const age = now.diff(dob, 'years');
// console.log(age,"age");
if(age<18)
{
  setErrors((prevErrors) => ({
    ...prevErrors,
    dob: 'Age must be above 18',
  }));
}
else{
  setErrors((prevErrors) => ({
    ...prevErrors,
    dob: '',
  }));
}
    } else if (name === 'Simage') {
      if (files.length === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          files: 'Please select at least one file',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          files: '',
        }));
      }}
    
}
// delete 
const  handleDelete = async(id,data)=>{
  console.log(id,"id del");
 let del= await axios.post('http://localhost:4000/post/deleted',data)
console.log(del,"del");
 if(del.data==="deleted")
 {
     alert("Succesfully Deleted");
     window.location.reload();
 }
}
// submit datas 
  const  handleSubmit = async (e)=>{
    e.preventDefault();

console.log(Details,"details");
console.log(simage.Simage,"images");
let photo =[];
photo = simage.Simage;
console.log(photo,"photo");
console.log(photo.length,"photo.length");
  
const Fdata = new FormData();
Fdata.append("StudentName",Details.StudentName);
Fdata.append("StudentEmail",Details.StudentEmail);
Fdata.append("StudentDOB",Details.StudentDOB);

for (let i = 0; i < photo.length; i++) {
  Fdata.append("file", photo[i])
}
console.log(Fdata,"Fdata");
if(Details.StudentName.length>0&&Details.StudentEmail.length>0&&Details.StudentDOB.length>0&&errors.name===""&&errors.email===""&&errors.dob===""&&errors.files==="")
{
try{
  let result=  await axios.post("http://localhost:4000/submit",Fdata)
  if(result.data==="submitted")
                {
                    alert("succesfully submited");
                    window.location.reload();
                  }
                else{
                    alert("something went wrong warning :)")
                }
}catch(error)
{
  console.log(error);
}

}
else{
  alert("Must be Required all Field")
}
}
// handle changes
const handleChange = (e) =>{
    const name =e.target.name;
    const value = e.target.value;
    const files=e.target.files;
    console.log(name,"name");
    console.log(value,"value");
    console.log(files,"files");
      if (files!==null) {
        setSimage({[name]:files});
        console.log(simage,"images");
      }
      setDetails({ ...Details, [name]: value });
    
    if (name === 'StudentName') {
      if (value.trim() === '') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: 'Name is required',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: '',
        }));
      }
    } else if (name === 'StudentEmail') {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Invalid email format',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '',
        }));
      }
    } else if (name === 'StudentDOB') {
      const now = moment();
// console.log(now,"now");
const dob = moment(Details.StudentDOB, 'YYYY-MM-DD');
// console.log(dob,"dob");
const age = now.diff(dob, 'years');
// console.log(age,"age");
if(age<18)
{
  setErrors((prevErrors) => ({
    ...prevErrors,
    dob: 'Age must be above 18',
  }));
}
else{
  setErrors((prevErrors) => ({
    ...prevErrors,
    dob: '',
  }));
}
    } else if (name === 'Simage') {
      if (files.length === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          files: 'Please select at least one file',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          files: '',
        }));
      }}
    }
	return (
            <div className="container-fluid">
            <div className="row">
             <div className="col">
             {page===1?(
              <>
                <nav class="navbar navbar-expand-lg  justify-content-center navbar-light bg-light">
             <h1 className="text-center">Student Details Form</h1>
            </nav>
               <form className="bg-dark">
                {updatebtn ?
                (
                <>
                  <div  class="form-group">
                <label class="col-form-label col-form-label-m text-white">Student Name</label>
                <input class="form-control form-control-lg" type='text'name='StudentName' required value={updatedetails.StudentName}  onChange={handleUpdate}></input>
                {errors.name && <span  style={{color:"red"}}>{errors.name}</span>}
                </div>
                </>
                ) 
                : 
                (
                <>
                <div  class="form-group">
                <label class="col-form-label col-form-label-m text-white">Student Name</label>
                <input class="form-control form-control-lg" type='text'name='StudentName' required  onChange={handleChange}></input>
                {errors.name && <span  style={{color:"red"}}>{errors.name}</span>}
                </div>
                </>
                )
                }
                <br/>
                {updatebtn ?
                (
                <>
                 <div  class="form-group">
                <label class="col-form-label col-form-label-m text-white">Student Id</label>
                <input class="form-control form-control-lg" type='text'disabled name='Sno' value={updatedetails.Sno}></input>
                </div>
                </>
                ) 
                : 
                (
                <>
                 <div  class="form-group">
                <label class="col-form-label col-form-label-m text-white">Student Id</label>
                <input class="form-control form-control-lg" type='text'disabled name='Sno' placeholder='disabled'></input>
                </div>
                </>
                )
                }
                <br/>
                {updatebtn ?
                (
                <>
                <div  class="form-group">
                <label class="col-form-label col-form-label-m text-white">Student Email</label>
                <input class="form-control form-control-lg" type='email' required name='StudentEmail' value={updatedetails.StudentEmail} onChange={handleUpdate}></input>
                {errors.email && <span  style={{color:"red"}}>{errors.email}</span>}
                </div>
                </>
                ) 
                : 
                (
                <>
                <div  class="form-group">
                <label class="col-form-label col-form-label-m text-white">Student Email</label>
                <input class="form-control form-control-lg" type='email' required name='StudentEmail' onChange={handleChange}></input>
                {errors.email && <span  style={{color:"red"}}>{errors.email}</span>}
                </div>
                </>
                )
                }
                <br/>
                {updatebtn ?
                (
                <>
                 <div  class="form-group">
                    <label class="col-form-label col-form-label-m text-white">Date of birth</label>
                    <input class="form-control form-control-lg" type='date' name='StudentDOB' required value={updatedetails.StudentDOB} onChange={handleUpdate}></input>
                    {errors.dob && <span style={{color:"red"}}>{errors.dob}</span>}
                </div>
                </>
                ) 
                : 
                (
                <>
                <div  class="form-group">
                    <label class="col-form-label col-form-label-m text-white">Date of birth</label>
                    <input class="form-control form-control-lg" type='date' name='StudentDOB' required onChange={handleChange}></input>
                    {errors.dob && <span style={{color:"red"}}>{errors.dob}</span>}
                </div>
                </>
                )
                }
                
                <br/>
                {updatebtn ?
                (
                <>
                 <div class="form-group">
                <label class="col-form-label col-form-label-m text-white">STUDENT IMAGE</label>
                <input class="form-control form-control-lg"  type="file" name="Simage" multiple required onChange={handleUpdate}></input>
                {errors.files && <span style={{color:"red"}}>{errors.files}</span>}
                </div>
                </>
                ) 
                : 
                (
                <>
                <div class="form-group">
                <label class="col-form-label col-form-label-m text-white">STUDENT IMAGE</label>
                <input class="form-control form-control-lg"  type="file" name="Simage" multiple required onChange={handleChange}></input>
                {errors.files && <span style={{color:"red"}}>{errors.files}</span>}
                </div>
                </>
                )
                }
               
                <br/>
                {updatebtn ?
                (
                <>
                <div className="btn-groups ">
                 <button className="btn btn-lg btn-block  bg-primary" onClick={UpdateSubmit}>UPDATE</button>
                <button className="btn  btn-lg btn-block bg-success" onClick={handleView}>studentdetails</button> 
                 </div>
                </>
                ) 
                : 
                (
                <>
                <div className="btn-groups ">
                 <button className="btn btn-lg btn-block  bg-primary" onClick={handleSubmit}>submit</button>
                 <button className="btn btn-lg btn-block bg-secondary" type='reset'>cancel</button>
                <button className="btn  btn-lg btn-block bg-success" onClick={handleView}>studentdetails</button> 
                 </div>
                </>
                )
                }
                
            </form>
              </>
             )
             :
            (
              <>
               
              <button className="btn  btn-lg btn-block bg-success" onClick={backtoform}>back</button> 
              <nav class="navbar navbar-expand-lg  justify-content-center navbar-light bg-light">
               <h1 className="text-center">Student Details List</h1>
              </nav>
              <br/>
              <div>
              <br/>
              <table  class="table  table-bordered table-success">
             <thead  class="thead-dark">
             <tr>
             <th scope="col">Student No</th>
             <th scope="col">StudentName</th>
             <th scope="col">StudentEmail</th>
             <th scope="col">StudentDOB</th>
             <th scope="col">Image</th>
             <th scope="col">EDIT</th>
             <th scope="col">DELETE</th>
             </tr>
             </thead>
    {studentDetails&&studentDetails.map((ival,i)=>
    <tbody>
    <tr class="table-primary">
    <th scope="row">{ival.Sno}</th>
     <td>{ival.StudentName}</td>
      <td>{ival.StudentEmail}</td>
      <td>{ival.StudentDOB}</td>
      <td>{ival.Simage}</td>
      <td><button className="btn btn-m bg-warning" onClick={(Sno)=>handleEdit(ival.Sno,ival)}>EDIT</button></td>
      <td><button className="btn btn-m bg-danger" onClick={(Sno)=>handleDelete(ival.Sno,ival)}>DELETE</button></td>
    </tr>
  </tbody>           
  )}
   
  </table>
              </div>
               </>
            )
             }
           
             </div>
          </div>
        </div>
)
}
export default AdminUpload;

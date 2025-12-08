import React from 'react';
import { FaRegEyeSlash } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import NewPassward from '../NewPassward/newpassward';

const ForgetPassward = () => {
  return (
<div className="w-full  flex items-center justify-center p-4 py-8" dir='rtl'>      
      {/* البطاقة الرئيسية */}
      <div className=" border-none rounded-2xl p-4 max-w-md w-full">
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2 w-full pt-28">
         هل نسيت كلمة المرور الخاصة بك ؟
        </h1>

        <p className="text-center text-gray-600 mb-6">
          أدخل بريدك الالكتروني الشخصي لإكمال العملية الآن! 
        </p>

        <div className="space-y-4 w-full">
          {/* حقل البريد الإلكتروني */}
          <div>
            <label className="block  mb-2 text-right font-bold text-black">البريد الإلكتروني</label>
            <input 
              type="email" 
              placeholder="أدخل البريد الالكتروني"
              className=" text-gray-700 w-full px-4 py-3 mb-6 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className='flex-row w-full mx-0'>
        <Link to={"/newpassward"} className="w-3/5 start-0 mr-0 bg-blue-300 hover:bg-blue-700 text-white py-3 px-4 mb-6 font-medium transition-colors rounded-3xl">
         التالي
         </Link>
        <button className="w-1/5 end-0 mr-6 border-gray-200 border-2 hover:bg-blue-700 text-black py-3 px-4 mb-6 font-medium transition-colors rounded-3xl">
         إلغاء
        </button>
         </div>
      </div>
    </div>
  );
};

export default ForgetPassward;
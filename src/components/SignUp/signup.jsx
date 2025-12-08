import React from 'react';
import { FaRegEyeSlash } from "react-icons/fa6";
import SignInForm from '../SignIn/signin';
import { Link } from 'react-router-dom';

const SignUpForm = () => {

  return (
<div className="w-full  flex items-center justify-center p-4 py-8" dir='rtl'>      
      {/* البطاقة الرئيسية */}
      <div className=" border-none rounded-2xl p-4 max-w-md w-full">
        
        {/* 1. العنوان الرئيسي */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          إنشاء حساب جديد
        </h1>
        {/* 2. رابط للمستخدمين الحاليين */}
        <p className="text-center text-gray-600 mb-6">
       هل لديك حساب على المنصة السورية 
     <Link to="/signin" className="text-blue-400 hover:underline font-medium mr-1">
     سجل دخولك
     </Link>
      </p>

        {/* 5. حقول الإدخال */}
        <div className="space-y-4">
          {/* حقل الاسم */}
          <div>
            <label className="block  mb-2 text-right font-bold text-black" >الاسم</label>
            <input 
              type="text" 
              placeholder="أدخل اسمك الكامل"
              className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* حقل البريد الإلكتروني */}
          <div>
            <label className="block  mb-2 text-right font-bold text-black">البريد الإلكتروني</label>
            <input 
              type="email" 
              placeholder="أدخل البريد الالكتروني"
              className=" text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className='relative'>
            <label className="block mb-2 text-right font-bold text-black">كلمة المرور</label>
            <p className="text-sm text-gray-600 text-right pb-2">
           6 أحرف على الأقل من فضلك  يجب أن تحتوي على رموز أيضا 
            </p>
            <div className="relative">
            <input 
              type="password" 
              placeholder="أدخل كلمة المرور"
              className="  w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2
               focus:ring-blue-500 focus:border-transparent "
            />
            <FaRegEyeSlash className='absolute left-4 top-1/2 transform -translate-y-1/2 text-black '/>
            </div>
          </div>
        </div>

        {/* 7. خانة الموافقة على الشروط */}
        <div className="flex items-start gap-3 my-6">
          <input 
            type="checkbox"
            className="mt-1 bg-blue-300 text-md"
          />
          <label className="text-black text-sm">
           قبول سياسة الخصوصية والشروط 
          </label>
        </div>

        {/* 8. زر إنشاء الحساب */}
        <button className="w-full bg-blue-300 hover:bg-blue-700 text-white py-3 px-4 font-medium transition-colors rounded-4xl">
          إنشاء حساب
        </button>

      </div>
    </div>
  );
};

export default SignUpForm;
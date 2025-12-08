import React from 'react';
import { FaRegEyeSlash } from "react-icons/fa6";

const NewPassward = () => {
  return (
<div className="w-full  flex items-center justify-center p-4 py-8 pt-24" dir='rtl'>      
      {/* البطاقة الرئيسية */}
      <div className=" border-none rounded-2xl p-4 max-w-md w-full">
        
        {/* 1. العنوان الرئيسي */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          إنشاء كلمة مرور جديدة
        </h1>
        {/* 2. رابط للمستخدمين الحاليين */}
        <p className="text-center text-gray-600 mb-6 w-full mx-0 text-sm">
          يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمات المرور الأخرى.
        </p>

        {/* 5. حقول الإدخال */}
        <div className="space-y-4">


          {/* حقل كلمة المرور */}
          <div className='relative'>
            <label className="block mb-2 text-right font-bold text-black">كلمة المرور</label>
            <p className="text-sm text-gray-600 text-right pb-2">
           6 أحرف على الأقل من فضلك  يجب أن تحتوي على رموز أيضا 
            </p>
            <div className="relative">
            <input 
              type="password" 
              placeholder="أدخل كلمة السر"
              className="  w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2
               focus:ring-blue-500 focus:border-transparent "
            />
            <FaRegEyeSlash className='absolute left-4 top-1/2 transform -translate-y-1/2 text-black '/>
            </div>
          </div>

          {/* حقل تأكيد كلمة المرور */}

          <div className='relative pb-6'>
            <label className="block mb-2 text-right font-bold text-black">تأكيد كلمة المرور</label>
            <p className="text-sm text-gray-600 text-right pb-2">
           6 أحرف على الأقل من فضلك  يجب أن تحتوي على رموز أيضا 
            </p>
            <div className="relative">
            <input 
              type="password" 
              placeholder="أدخل كلمة السر"
              className="  w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2
               focus:ring-blue-500 focus:border-transparent "
            />
            <FaRegEyeSlash className='absolute left-4 top-1/2 transform -translate-y-1/2 text-black '/>
            </div>
          </div>
        </div>

        {/* 8. زر إنشاء كلمة مرور جديدة */}
        <div className='flex-row w-full mx-0'>
        <button className="w-3/5 start-0 mr-0 bg-blue-300 hover:bg-blue-700 text-white py-3 px-4 mb-6 font-medium transition-colors rounded-3xl">
         إنشاء كلمة مرور جديدة
        </button>
        <button className="w-1/5 end-0 mr-6 border-gray-200 border-2 hover:bg-blue-700 text-black py-3 px-4 mb-6 font-medium transition-colors rounded-3xl">
         إلغاء
        </button>
         </div>

      </div>
    </div>
  );
};

export default NewPassward;
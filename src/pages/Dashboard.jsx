const Dashboard = () => {
  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto pt-7 max-w-7xl">
      <div className="w-screen h-36"></div>
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mt-36">Dashboard</h1>
      </div>

      <div className="w-full h-10"></div>
      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow border">
          <p className="text-gray-600 text-sm mb-2">الموظفين</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">٥٢</span>
            <span className="text-green-600 text-xs">+٤ أسبوعياً</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border">
          <p className="text-gray-600 text-sm mb-2">المشاريع</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">٦</span>
            <span className="text-blue-600 text-xs">نشطة</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border">
          <p className="text-gray-600 text-sm mb-2">المهام</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">٧</span>
            <span className="text-yellow-600 text-xs">+٢ جديدة</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border">
          <p className="text-gray-600 text-sm mb-2">الإنجاز</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">٨٥٪</span>
            <span className="text-green-600 text-xs">+٥٪</span>
          </div>
        </div>
      </div>

      <div className="w-full h-10"></div>
      {/* محتوى رئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ">
        {/* قسم المهام */}
        <div className="bg-white rounded-lg shadow border p-5">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            المهام اليومية
          </h2>
          <div className="space-y-3">
            {[
              "تسليم تقرير المبيعات",
              "اجتماع الفريق",
              "مراجعة العقود",
              "تحديث البيانات",
            ].map((task, i) => (
              <div key={i} className="flex items-center p-3 border rounded">
                <input type="checkbox" className="ml-3" />
                <span className="mr-2 text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الأداء */}
        <div className="bg-white rounded-lg shadow border p-5">
          <h2 className="text-lg font-bold mb-4 text-gray-800">أداء الأقسام</h2>
          <div className="space-y-4">
            {[
              { name: "المبيعات", value: 8, color: "bg-blue-500" },
              { name: "التسويق", value: 6, color: "bg-green-500" },
              { name: "التطوير", value: 4, color: "bg-yellow-500" },
              { name: "الدعم", value: 2, color: "bg-purple-500" },
            ].map((dept, i) => (
              <div key={i} className="flex items-center">
                <span className="w-20 text-gray-700 text-sm">{dept.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${dept.color} h-2.5 rounded-full`}
                    style={{ width: `${dept.value * 10}%` }}
                  ></div>
                </div>
                <span className="mr-3 text-sm font-bold">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import PostureDetection from "@/components/analysis/PostureDetection";
import PostureStats from "@/components/analysis/PostureStats";

const AnalysisSection = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Posture Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track and analyze your posture in real-time with instant feedback.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3 p-6">
              <PostureDetection />
            </div>
            
            <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-700 p-6">
              <PostureStats />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;

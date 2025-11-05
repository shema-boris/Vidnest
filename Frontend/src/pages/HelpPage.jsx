import { useState } from 'react';
import Button from '../components/common/Button';
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon, 
  ShareIcon,
  BookmarkIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('mobile');

  const tabs = [
    { id: 'mobile', label: 'Mobile', icon: DevicePhoneMobileIcon },
    { id: 'desktop', label: 'Desktop', icon: ComputerDesktopIcon }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Use VidNest</h1>
        <p className="text-gray-600">Learn how to save and organize videos from any platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Instructions */}
      {activeTab === 'mobile' && (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <ShareIcon className="h-6 w-6 mr-2" />
              Mobile Share Integration
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Install VidNest as PWA</h3>
                  <p className="text-blue-700 text-sm">Open VidNest in your mobile browser and tap "Add to Home Screen"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Find a Video</h3>
                  <p className="text-blue-700 text-sm">Browse TikTok, Instagram, YouTube, or any video platform</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Share to VidNest</h3>
                  <p className="text-blue-700 text-sm">Tap the "Share" button and select "VidNest" from the share menu</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Save to Library</h3>
                  <p className="text-blue-700 text-sm">VidNest opens with video preview - add tags, category, and save!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Supported Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold">YT</span>
                </div>
                <p className="text-sm text-green-700">YouTube</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">TT</span>
                </div>
                <p className="text-sm text-green-700">TikTok</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-pink-600 font-bold">IG</span>
                </div>
                <p className="text-sm text-green-700">Instagram</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">FB</span>
                </div>
                <p className="text-sm text-green-700">Facebook</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Instructions */}
      {activeTab === 'desktop' && (
        <div className="space-y-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
              <LinkIcon className="h-6 w-6 mr-2" />
              Quick URL Import
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Copy Video URL</h3>
                  <p className="text-purple-700 text-sm">Copy the URL of any video from YouTube, TikTok, Instagram, etc.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Paste in VidNest</h3>
                  <p className="text-purple-700 text-sm">Go to VidNest homepage and paste the URL in the "Quick Import" section</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Review & Save</h3>
                  <p className="text-purple-700 text-sm">VidNest extracts metadata automatically - add tags and save!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center">
              <BookmarkIcon className="h-6 w-6 mr-2" />
              Browser Bookmarklet (Advanced)
            </h2>
            <p className="text-orange-700 mb-4">For power users who want one-click saving from any video page:</p>
            
            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Install Bookmarklet:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700">
                <li>Drag this button to your bookmarks bar:</li>
                <li className="mt-2">
                  <a 
                    href="javascript:(function(){const url=window.location.href;const title=document.title;const vidnestUrl=`${window.location.origin}/videos/add?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;window.open(vidnestUrl,'_blank');})();"
                    className="inline-block bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700"
                  >
                    Save to VidNest
                  </a>
                </li>
                <li>Click the bookmarklet on any video page to save it instantly!</li>
              </ol>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Automatic Metadata</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Video title and description</li>
                  <li>• Thumbnail images</li>
                  <li>• Platform detection</li>
                  <li>• Creator information</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Organization</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Custom categories</li>
                  <li>• Tag system</li>
                  <li>• Search and filter</li>
                  <li>• Personal library</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default HelpPage;



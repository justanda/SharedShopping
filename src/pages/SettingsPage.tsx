import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardTitle } from '../components/common/Card';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState('imperial');
  const [language, setLanguage] = useState('english');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-neutral-800">Settings</h1>
      
      <div className="space-y-8">
        {/* Appearance */}
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4 text-neutral-800">Appearance</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800">Dark Mode</h3>
                  <p className="text-sm text-neutral-500">Use dark theme throughout the application</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800">Font Size</h3>
                  <p className="text-sm text-neutral-500">Adjust the text size</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">Medium</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4 text-neutral-800">Notifications</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800">App Notifications</h3>
                  <p className="text-sm text-neutral-500">Enable push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800">Email Notifications</h3>
                  <p className="text-sm text-neutral-500">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Preferences */}
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4 text-neutral-800">Preferences</CardTitle>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-neutral-800 mb-2">Measurement System</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="measurement"
                      value="imperial"
                      checked={measurementSystem === 'imperial'}
                      onChange={() => setMeasurementSystem('imperial')}
                      className="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Imperial (oz, lb, cups)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="measurement"
                      value="metric"
                      checked={measurementSystem === 'metric'}
                      onChange={() => setMeasurementSystem('metric')}
                      className="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Metric (g, kg, ml)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-neutral-800 mb-2">Language</h3>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full max-w-xs rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4 text-neutral-800">Data Management</CardTitle>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-neutral-800">Export Data</h3>
                <p className="text-sm text-neutral-500 mb-2">Download your recipes and shopping lists</p>
                <Button variant="outline" size="sm">Export as JSON</Button>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="font-medium text-neutral-800 text-red-600">Danger Zone</h3>
                <p className="text-sm text-neutral-500 mb-2">Delete all your data and reset the application</p>
                <Button variant="danger" size="sm">Reset Application</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;

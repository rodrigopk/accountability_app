import UIKit
import React
import ReactAppDependencyProvider
import ReactNativeNavigation

@main
class AppDelegate: RNNAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Set up a custom delegate that provides the bundle URL
    self.reactNativeDelegate = CustomReactNativeDelegate()
    
    // RNNAppDelegate handles React Native Navigation setup
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

// Custom delegate to provide the bundle URL
class CustomReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

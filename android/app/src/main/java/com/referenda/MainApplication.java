package com.referenda;

import android.app.Application;

import com.facebook.react.ReactApplication;
import sqip.react.SquareInAppPaymentsPackage;
import com.reactnativepayments.ReactNativePaymentsPackage;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.barefootcoders.android.react.KDSocialShare.KDSocialShare;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.peel.react.rnos.RNOSModule;
import com.oblador.keychain.KeychainPackage;
import com.sudoplz.reactnativeamplitudeanalytics.RNAmplitudeSDKPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.horcrux.svg.SvgPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SquareInAppPaymentsPackage(),
            new ReactNativePaymentsPackage(),
            new AutoGrowTextInputPackage(),
            new KDSocialShare(),
            new ReactNativeContacts(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNOSModule(),
            new KeychainPackage(),
            new RNAmplitudeSDKPackage(),
            new RandomBytesPackage(),
            new RNCameraPackage(),
            new ReactVideoPackage(),
            new SvgPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage(),
            new RNI18nPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

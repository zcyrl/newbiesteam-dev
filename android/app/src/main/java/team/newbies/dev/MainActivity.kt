package team.newbies.dev

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.Animatable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import androidx.core.view.WindowCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File

class MainActivity : AppCompatActivity() {

    companion object {
        private const val SPLASH_TIMEOUT_MS = 4500L
    }

    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var webView: WebView
    private lateinit var splashOverlay: FrameLayout
    private lateinit var splashGlow: View
    private lateinit var splashLogo: ImageView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    private var splashAnimatorSet: AnimatorSet? = null
    private var isSplashDismissed = false
    private val splashHandler = Handler(Looper.getMainLooper())
    private val splashTimeoutRunnable = Runnable { dismissSplash() }

    private var onDownloadCompleteReceiver: BroadcastReceiver? = null
    private var lastDownloadId: Long = -1L
    private var lastDownloadedFileName: String = "NewbiesDev.apk"

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data
            val uriList = mutableListOf<Uri>()
            if (data?.clipData != null) {
                val count = data.clipData!!.itemCount
                for (i in 0 until count) {
                    uriList.add(data.clipData!!.getItemAt(i).uri)
                }
            } else if (data?.data != null) {
                uriList.add(data.data!!)
            }
            filePathCallback?.onReceiveValue(uriList.toTypedArray())
        } else {
            filePathCallback?.onReceiveValue(null)
        }
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupEdgeToEdge()
        setContentView(R.layout.activity_main)

        // Unlock the display's maximum panel refresh rate (up to 144Hz on supported panels)
        unlockHighRefreshRate()

        swipeRefresh = findViewById(R.id.swipeRefresh)
        webView = findViewById(R.id.webView)
        splashOverlay = findViewById(R.id.splashOverlay)
        splashGlow = findViewById(R.id.splashGlow)
        splashLogo = findViewById(R.id.splashLogo)

        checkVersionAndWipeSessionOnUpdate()

        setupDownloadReceiver()
        setupWebView()
        setupSwipeRefresh()
        setupBackNavigation()
        startSplashAnimation()

        // Load offline embedded assets
        webView.loadUrl("file:///android_asset/index.html")

        // Safety fallback timer so the splash always dismisses even if assets load slowly
        splashHandler.postDelayed(splashTimeoutRunnable, SPLASH_TIMEOUT_MS)
    }

    private fun unlockHighRefreshRate() {
        try {
            val display = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                display
            } else {
                @Suppress("DEPRECATION")
                windowManager.defaultDisplay
            } ?: return
            val modes = display.supportedModes ?: return
            val current = display.mode
            val best = modes
                .filter { it.physicalWidth == current.physicalWidth && it.physicalHeight == current.physicalHeight }
                .maxByOrNull { it.refreshRate } ?: return
            if (best.modeId != current.modeId) {
                val params = window.attributes
                params.preferredDisplayModeId = best.modeId
                window.attributes = params
            }
        } catch (_: Exception) {
            // Some devices deny mode switching; silently keep system default.
        }
    }

    /** Animated brand splash, same choreography as the NewbiesTeam public app. */
    private fun startSplashAnimation() {
        (splashLogo.drawable as? Animatable)?.start()

        val glowAlpha = ObjectAnimator.ofFloat(splashGlow, View.ALPHA, 0.35f, 0.85f).apply {
            duration = 1300
            repeatMode = ValueAnimator.REVERSE
            repeatCount = ValueAnimator.INFINITE
            interpolator = AccelerateDecelerateInterpolator()
        }

        splashAnimatorSet = AnimatorSet().apply {
            play(glowAlpha)
            start()
        }
    }

    private fun dismissSplash() {
        if (isSplashDismissed) return
        isSplashDismissed = true
        splashHandler.removeCallbacks(splashTimeoutRunnable)

        splashOverlay.animate()
            .alpha(0f)
            .setDuration(420)
            .withEndAction {
                splashAnimatorSet?.cancel()
                (splashLogo.drawable as? Animatable)?.stop()
                splashOverlay.visibility = View.GONE
            }
            .start()
    }

    private fun checkVersionAndWipeSessionOnUpdate() {
        try {
            val prefs = getSharedPreferences("newbies_dev_prefs", Context.MODE_PRIVATE)
            val savedVersionCode = prefs.getInt("saved_app_version_code", -1)
            val currentVersionCode = BuildConfig.VERSION_CODE

            if (savedVersionCode != -1 && savedVersionCode != currentVersionCode) {
                // App was updated to a new version!
                // Wipe saved developer session and clear WebStorage so key is re-requested once
                prefs.edit()
                    .remove("saved_dev_state")
                    .putInt("saved_app_version_code", currentVersionCode)
                    .commit()
                android.webkit.WebStorage.getInstance().deleteAllData()
            } else if (savedVersionCode == -1) {
                prefs.edit().putInt("saved_app_version_code", currentVersionCode).commit()
            }
        } catch (_: Exception) {}
    }

    private fun setupEdgeToEdge() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.parseColor("#0E0F12")
        window.navigationBarColor = Color.parseColor("#0E0F12")

        val controller = WindowCompat.getInsetsController(window, window.decorView)
        controller.isAppearanceLightStatusBars = false
        controller.isAppearanceLightNavigationBars = false
    }

    private fun setupDownloadReceiver() {
        val filter = IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
        onDownloadCompleteReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L) ?: -1L
                if (id == lastDownloadId && id != -1L) {
                    handleDownloadedApk(id)
                }
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(onDownloadCompleteReceiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(onDownloadCompleteReceiver, filter)
        }
    }

    private fun handleDownloadedApk(downloadId: Long) {
        try {
            val downloadManager = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            val query = DownloadManager.Query().setFilterById(downloadId)
            val cursor = downloadManager.query(query)
            if (cursor != null && cursor.moveToFirst()) {
                val statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)
                if (statusIndex != -1 && cursor.getInt(statusIndex) == DownloadManager.STATUS_SUCCESSFUL) {
                    val file = File(
                        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
                        lastDownloadedFileName
                    )
                    if (file.exists()) {
                        promptInstallApk(file)
                    } else {
                        val uri = downloadManager.getUriForDownloadedFile(downloadId)
                        if (uri != null) {
                            promptInstallUri(uri)
                        } else {
                            Toast.makeText(this, "Download complete: $lastDownloadedFileName", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
                cursor.close()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Download finished. Tap notification to install.", Toast.LENGTH_LONG).show()
        }
    }

    private fun promptInstallApk(file: File) {
        try {
            val apkUri = FileProvider.getUriForFile(
                this,
                "${applicationContext.packageName}.provider",
                file
            )
            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
            }
            startActivity(installIntent)
        } catch (e: Exception) {
            Toast.makeText(this, "Downloaded to Downloads folder. Please tap file to install.", Toast.LENGTH_LONG).show()
        }
    }

    private fun promptInstallUri(uri: Uri) {
        try {
            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/vnd.android.package-archive")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
            }
            startActivity(installIntent)
        } catch (e: Exception) {
            Toast.makeText(this, "Downloaded to Downloads folder. Please tap file to install.", Toast.LENGTH_LONG).show()
        }
    }

    fun downloadApk(url: String, fileName: String) {
        try {
            val cleanName = if (fileName.isNotBlank()) fileName else "NewbiesDev.apk"
            lastDownloadedFileName = cleanName

            val request = DownloadManager.Request(Uri.parse(url)).apply {
                setTitle("NewbiesDev Update")
                setDescription("Downloading $cleanName...")
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, cleanName)
                setMimeType("application/vnd.android.package-archive")
            }
            val downloadManager = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            lastDownloadId = downloadManager.enqueue(request)
            Toast.makeText(this, "Downloading $cleanName in background...", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            // Fallback to external browser
            try {
                val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                startActivity(browserIntent)
            } catch (err: Exception) {
                Toast.makeText(this, "Download error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.setBackgroundColor(Color.parseColor("#0E0F12"))

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.userAgentString = "${settings.userAgentString} NewbiesDevAndroid/${BuildConfig.VERSION_NAME} (Build ${BuildConfig.VERSION_CODE})"

        webView.addJavascriptInterface(AndroidBridge(this), "AndroidBridge")

        webView.setDownloadListener { url, _, _, _, _ ->
            val fileName = if (url.contains(".apk")) {
                url.substringAfterLast("/").substringBefore("?")
            } else {
                "NewbiesDev.apk"
            }
            downloadApk(url, fileName)
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: android.webkit.ConsoleMessage?): Boolean {
                android.util.Log.d("NewbiesDev", "${message?.message()} [${message?.sourceId()}:${message?.lineNumber()}]")
                return true
            }

            override fun onJsAlert(
                view: WebView?,
                url: String?,
                message: String?,
                result: android.webkit.JsResult?
            ): Boolean {
                androidx.appcompat.app.AlertDialog.Builder(this@MainActivity)
                    .setTitle("NewbiesDev")
                    .setMessage(message ?: "")
                    .setPositiveButton(android.R.string.ok) { _, _ -> result?.confirm() }
                    .setOnCancelListener { result?.cancel() }
                    .show()
                return true
            }

            override fun onJsConfirm(
                view: WebView?,
                url: String?,
                message: String?,
                result: android.webkit.JsResult?
            ): Boolean {
                androidx.appcompat.app.AlertDialog.Builder(this@MainActivity)
                    .setTitle("NewbiesDev")
                    .setMessage(message ?: "")
                    .setPositiveButton(android.R.string.ok) { _, _ -> result?.confirm() }
                    .setNegativeButton(android.R.string.cancel) { _, _ -> result?.cancel() }
                    .setOnCancelListener { result?.cancel() }
                    .show()
                return true
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "image/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }
                try {
                    fileChooserLauncher.launch(intent)
                } catch (e: ActivityNotFoundException) {
                    this@MainActivity.filePathCallback = null
                    Toast.makeText(this@MainActivity, "No file manager found", Toast.LENGTH_SHORT).show()
                    return false
                }
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                injectNativeBridgeState(view)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectNativeBridgeState(view)
                swipeRefresh.isRefreshing = false
                dismissSplash()
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    dismissSplash()
                }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                return handleNavigation(url)
            }

            @Deprecated("Deprecated in Java")
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url == null) return false
                return handleNavigation(url)
            }
        }
    }

    private fun handleNavigation(url: String): Boolean {
        // Keep file assets and local relay in webview
        if (url.startsWith("file:///android_asset/")) {
            return false
        }
        // Direct APK download inside app
        if (url.endsWith(".apk") || url.contains(".apk?")) {
            val fileName = url.substringAfterLast("/").substringBefore("?")
            downloadApk(url, fileName)
            return true
        }
        // Handle custom intent schemes safely to prevent net::ERR_UNKNOWN_URL_SCHEME
        if (url.startsWith("intent:", ignoreCase = true)) {
            return try {
                val parsedIntent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                if (parsedIntent != null) {
                    val info = packageManager.resolveActivity(parsedIntent, 0)
                    if (info != null) {
                        startActivity(parsedIntent)
                        return true
                    }
                    val fallback = parsedIntent.getStringExtra("browser_fallback_url")
                    if (!fallback.isNullOrBlank()) {
                        val fbIntent = Intent(Intent.ACTION_VIEW, Uri.parse(fallback)).apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        startActivity(fbIntent)
                        return true
                    }
                }
                true
            } catch (e: Exception) {
                true
            }
        }
        // External links open in browser
        return try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
            true
        } catch (e: Exception) {
            true
        }
    }

    private fun setupSwipeRefresh() {
        // Disable swipe-to-refresh to prevent accidental page reloads while scrolling forms or modals
        swipeRefresh.isEnabled = false
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript("window.closeAnyOpenModal ? window.closeAnyOpenModal() : false") { res ->
                    val handled = res?.replace("\"", "")?.toBoolean() ?: false
                    if (!handled) {
                        if (webView.canGoBack()) {
                            webView.goBack()
                        } else {
                            finish()
                        }
                    }
                }
            }
        })
    }

    private fun injectNativeBridgeState(view: WebView?) {
        val script = """
            (function() {
                try {
                    window.__NBT_APP_VERSION__ = "${BuildConfig.VERSION_NAME}";
                    window.__NBT_BUILD_CODE__ = "${BuildConfig.VERSION_CODE}";
                    window.__NBT_IS_APP__ = true;
                    if (window.dispatchEvent) {
                        window.dispatchEvent(new CustomEvent("nbt:app-ready", {
                            detail: { version: "${BuildConfig.VERSION_NAME}", build: "${BuildConfig.VERSION_CODE}" }
                        }));
                    }
                } catch (e) {
                    console.error("NBT dev bridge error:", e);
                }
            })();
        """.trimIndent()
        view?.evaluateJavascript(script, null)
    }

    override fun onDestroy() {
        super.onDestroy()
        splashHandler.removeCallbacks(splashTimeoutRunnable)
        splashAnimatorSet?.cancel()
        (splashLogo.drawable as? Animatable)?.stop()
        if (onDownloadCompleteReceiver != null) {
            try {
                unregisterReceiver(onDownloadCompleteReceiver)
            } catch (_: Exception) {
            }
            onDownloadCompleteReceiver = null
        }
    }

    inner class AndroidBridge(private val activity: Activity) {
        private val prefs = activity.getSharedPreferences("newbies_dev_prefs", Activity.MODE_PRIVATE)

        @android.webkit.JavascriptInterface
        fun saveDevState(json: String): Boolean {
            return prefs.edit()
                .putString("saved_dev_state", json)
                .putInt("saved_app_version_code", BuildConfig.VERSION_CODE)
                .commit()
        }

        @android.webkit.JavascriptInterface
        fun getDevState(): String {
            return prefs.getString("saved_dev_state", "") ?: ""
        }

        @android.webkit.JavascriptInterface
        fun clearDevState(): Boolean {
            return prefs.edit().remove("saved_dev_state").commit()
        }

        @android.webkit.JavascriptInterface
        fun getDeviceId(): String {
            var id = prefs.getString("device_uuid", null)
            if (id == null) {
                id = java.util.UUID.randomUUID().toString()
                prefs.edit().putString("device_uuid", id).commit()
            }
            return id
        }

        @android.webkit.JavascriptInterface
        fun copyToClipboard(text: String): Boolean {
            val clipboard = activity.getSystemService(Activity.CLIPBOARD_SERVICE) as android.content.ClipboardManager
            val clip = android.content.ClipData.newPlainText("NewbiesKey", text)
            clipboard.setPrimaryClip(clip)
            return true
        }

        @android.webkit.JavascriptInterface
        fun getAppVersion(): String = BuildConfig.VERSION_NAME

        @android.webkit.JavascriptInterface
        fun getAppVersionCode(): Long = BuildConfig.VERSION_CODE.toLong()

        @android.webkit.JavascriptInterface
        fun isAndroidApp(): Boolean = true

        @android.webkit.JavascriptInterface
        fun getAppInfo(): String = """{"appName":"NewbiesDev","versionName":"${BuildConfig.VERSION_NAME}","versionCode":${BuildConfig.VERSION_CODE},"isNativeApp":true}"""

        @android.webkit.JavascriptInterface
        fun showToast(msg: String) {
            activity.runOnUiThread {
                Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show()
            }
        }

        @android.webkit.JavascriptInterface
        fun downloadAndInstallApk(url: String, fileName: String): Boolean {
            activity.runOnUiThread {
                (activity as? MainActivity)?.downloadApk(url, fileName)
            }
            return true
        }
    }
}

export function genHtmlRegisterOtp(code_verify: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Helvetica,Arial,sans-serif;">
      <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:20px auto;border-radius:8px;border:1px solid #eaeaea;">
              <tr>
                <td style="padding:32px;text-align:left;color:#001e2b;">
                  <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;">Xin chào,</h2>
                  <p style="margin:0 0 12px 0;font-size:16px;color:#333;">Mã xác thực email của bạn:</p>
                  <div style="margin:20px 0;text-align:center;">
                    <span style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;font-size:24px;font-weight:bold;letter-spacing:4px;">
                      ${code_verify}
                    </span>
                  </div>
                  <p style="margin:0;font-size:14px;color:#555;">Mã này có hiệu lực trong <b>10 phút</b>.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size:12px;padding:16px;color:#999;border-top:1px solid #eaeaea;">
                  Email được gửi tự động. Vui lòng không trả lời.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

export function genHtmlVerifyForgotEmail(email: string, code_verify: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Helvetica,Arial,sans-serif;">
      <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:20px auto;border-radius:8px;border:1px solid #eaeaea;">
              <tr>
                <td style="padding:32px;text-align:left;color:#001e2b;">
                  <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;">Xin chào,</h2>
                  <p style="margin:0 0 12px 0;font-size:16px;color:#333;">Mã xác thực quên mật khẩu của email ${email}:</p>
                  <div style="margin:20px 0;text-align:center;">
                    <span style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;font-size:24px;font-weight:bold;letter-spacing:4px;">
                      ${code_verify}
                    </span>
                  </div>
                  <p style="margin:0;font-size:14px;color:#555;">Mã này có hiệu lực trong <b>10 phút</b>.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size:12px;padding:16px;color:#999;border-top:1px solid #eaeaea;">
                  Email được gửi tự động. Vui lòng không trả lời.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

export function genHtmlStoreAccount(
    fullName: string,
    username: string,
    password: string,
) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Helvetica,Arial,sans-serif;">
    <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:20px auto;border-radius:8px;border:1px solid #eaeaea;">
            <tr>
              <td style="padding:32px;text-align:left;color:#001e2b;">
                <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;">Xin chào,</h2>
                <p style="margin:0 0 12px 0;font-size:16px;color:#333;">
                  Xin chào: <b>${fullName}</b>, Admin đã phê duyệt yêu cầu đăng ký tài khoản cửa hàng của bạn. Dưới đây là thông tin đăng nhập cho tài khoản store.
                </p>

                <div style="margin:16px 0;padding:16px;border-radius:8px;background:#f8fafc;border:1px solid #eef2ff;">
                  <p style="margin:0 0 8px 0;font-size:14px;color:#444;"><strong>Tên đăng nhập:</strong></p>
                  <p style="margin:0 0 12px 0;font-size:16px;color:#111;background:#fff;padding:10px;border-radius:6px;border:1px solid #e6e6e6;display:inline-block;">
                    ${username}
                  </p>

                  <p style="margin:12px 0 8px 0;font-size:14px;color:#444;"><strong>Mật khẩu:</strong></p>
                  <p style="margin:0;font-size:16px;color:#111;background:#fff;padding:10px;border-radius:6px;border:1px solid #e6e6e6;display:inline-block;letter-spacing:1px;">
                    ${password}
                  </p>
                </div>

                <p style="margin:16px 0 8px 0;font-size:14px;color:#555;">
                  Lưu ý: Vui lòng <strong>thay đổi mật khẩu</strong> sau khi đăng nhập để bảo mật tài khoản.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:12px;padding:16px;color:#999;border-top:1px solid #eaeaea;">
                Email được gửi tự động. Vui lòng không trả lời.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export function genHtmlStoreAccountReject(
    fullName: string,
) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Helvetica,Arial,sans-serif;">
    <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:20px auto;border-radius:8px;border:1px solid #eaeaea;">
            <tr>
              <td style="padding:32px;text-align:left;color:#001e2b;">
                <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;">Xin chào,</h2>
                <p style="margin:0 0 12px 0;font-size:16px;color:#333;">
                  Xin chào <b>${fullName}</b>, yêu cầu tạo tài khoản store đã không được chấp nhận, vui lòng liên hệ admin để biết thêm chi tiết.
                </p>

              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:12px;padding:16px;color:#999;border-top:1px solid #eaeaea;">
                Email được gửi tự động. Vui lòng không trả lời.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export function genHtmlForgotPasswordStore(
    storename: string,
    password: string,
    email: string,
) {
    return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Helvetica,Arial,sans-serif;">
    <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:20px auto;border-radius:8px;border:1px solid #eaeaea;">
            <tr>
              <td style="padding:32px;text-align:left;color:#001e2b;">
                <h2 style="margin:0 0 16px 0;font-size:22px;font-weight:600;">Xin chào,</h2>
                <p style="margin:0 0 12px 0;font-size:16px;color:#333;">
                  Mật khẩu mới cho store <b>${storename}</b>:
                </p>
                
                

                <div style="margin:16px 0;padding:16px;border-radius:8px;background:#f8fafc;border:1px solid #eef2ff;">

                  <p style="margin:12px 0 8px 0;font-size:14px;color:#444;"><strong>Tên tài khản:</strong></p>
                  <p style="margin:0;font-size:16px;color:#111;background:#fff;padding:10px;border-radius:6px;border:1px solid #e6e6e6;display:inline-block;letter-spacing:1px;">
                    ${email}
                  </p>
                  
                  <p style="margin:12px 0 8px 0;font-size:14px;color:#444;"><strong>Mật khẩu mới:</strong></p>
                  <p style="margin:0;font-size:16px;color:#111;background:#fff;padding:10px;border-radius:6px;border:1px solid #e6e6e6;display:inline-block;letter-spacing:1px;">
                    ${password}
                  </p>
                </div>

                <p style="margin:16px 0 8px 0;font-size:14px;color:#555;">
                  Lưu ý: Vui lòng <strong>thay đổi mật khẩu</strong> sau khi đăng nhập để bảo mật tài khoản.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:12px;padding:16px;color:#999;border-top:1px solid #eaeaea;">
                Email được gửi tự động. Vui lòng không trả lời.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

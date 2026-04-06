export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const SITE_ID = process.env.PUBLIC_KLAVIYO_SITE_ID;
  const LIST_ID = process.env.KLAVIYO_LIST_ID;

  try {
    const response = await fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + SITE_ID, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2023-12-15'
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  first_name: firstName || '',
                  properties: {
                    source: 'Psyllium Quiz'
                  }
                }
              }
            }
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: LIST_ID
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Klaviyo error:', errorData);
      return res.status(500).json({ error: 'Klaviyo subscription failed' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
